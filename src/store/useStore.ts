/**
 * Merkezi uygulama durumu (Zustand + AsyncStorage kaliciligi).
 *
 * Puan, seri ve guvenlik kararlari saf domain fonksiyonlarina delege edilir;
 * store yalnizca durumu birlestirir ve olaylari deterministik kurallara baglar.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  GOAL_TEMPLATES,
  FUTURE_SELF,
  MOTIVATION_HINTS,
  possibleFuturesFor,
} from '../data/seed';
import {
  applyEntries,
  buildDailyGoals,
  classifyText,
  completionEntries,
  computeBalance,
  dayKey,
  emptyStreaks,
  minimumDurationMinutes,
  recordBond,
  recordEvidence,
  safetyResponse,
  sendThreeEntries,
  shouldSuspendGame,
  SEASON_LENGTH_DAYS,
  STAGE_TARGET,
} from '../domain';
import type { Balance } from '../domain';
import type {
  AccessibilityPrefs,
  ChatMessage,
  Consents,
  DailyGoal,
  DailyPlan,
  EnergyLevel,
  Evidence,
  EveningReflection,
  GoalArea,
  Journey,
  NotificationPrefs,
  Profile,
  SafetyLabel,
  Streaks,
  ThoughtRecord,
} from '../types';

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function today(): string {
  return dayKey(new Date());
}

function nowIso(): string {
  return new Date().toISOString();
}

const DEFAULT_PROFILE: Profile = {
  displayName: '',
  consents: {
    photo: false,
    voice: false,
    ai: true,
    analytics: false,
    modelTraining: false,
  },
  notifications: {
    morning: true,
    planned: true,
    evening: true,
    comeback: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  },
  accessibility: {
    reduceMotion: false,
    muteSound: false,
    highContrast: false,
  },
};

export interface OnboardingPayload {
  displayName: string;
  area: GoalArea;
  northStar: string;
  whyItMatters: string;
  consents: Partial<Consents>;
}

export interface SafetyState {
  suspended: boolean;
  title: string;
  message: string;
  resources: { label: string; value: string }[];
}

const CLEAR_SAFETY: SafetyState = {
  suspended: false,
  title: '',
  message: '',
  resources: [],
};

function crisisSafetyState(): SafetyState {
  const response = safetyResponse('crisis');
  if (!response) return CLEAR_SAFETY;
  return {
    suspended: true,
    title: response.title,
    message: response.message,
    resources: response.resources,
  };
}

function thoughtRecordText(record: Omit<ThoughtRecord, 'id' | 'createdAt'>): string {
  return [
    record.situation,
    record.automaticThought,
    record.distortion,
    record.emotion,
    record.behavior,
    record.balancedThought,
    record.experiment,
    record.learning,
  ]
    .filter(Boolean)
    .join(' ');
}

interface StoreState {
  hydrated: boolean;
  onboardingComplete: boolean;
  profile: Profile;
  journey: Journey | null;
  plansByDate: Record<string, DailyPlan>;
  ledger: ReturnType<typeof applyEntries>;
  streaks: Streaks;
  evidence: Evidence[];
  thoughtRecords: ThoughtRecord[];
  messages: ChatMessage[];
  safety: SafetyState;

  balance: () => Balance;
  getPlan: (date: string) => DailyPlan | undefined;
  completeOnboarding: (payload: OnboardingPayload) => void;
  resetAll: () => void;
  setConsent: (key: keyof Consents, value: boolean) => void;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean | string) => void;
  setAccessibilityPref: (key: keyof AccessibilityPrefs, value: boolean) => void;
  startMorning: (date: string) => void;
  setEnergy: (date: string, energy: EnergyLevel) => void;
  shrinkGoal: (date: string, goalId: string) => void;
  editGoalTitle: (date: string, goalId: string, title: string) => void;
  commitPlan: (date: string) => void;
  completeGoal: (date: string, goalId: string) => void;
  saveReflection: (date: string, reflection: Omit<EveningReflection, 'createdAt'>) => void;
  addThoughtRecord: (record: Omit<ThoughtRecord, 'id' | 'createdAt'>) => void;
  sendMessage: (text: string) => SafetyLabel;
  acknowledgeSafety: () => void;
}

function makeJourney(payload: OnboardingPayload): Journey {
  return {
    id: newId('journey'),
    area: payload.area,
    northStar: payload.northStar,
    whyItMatters: payload.whyItMatters,
    startDate: today(),
    seasonLengthDays: SEASON_LENGTH_DAYS,
    stageTarget: STAGE_TARGET,
    status: 'active',
    possibleFutures: possibleFuturesFor(payload.area),
    motivationHints: MOTIVATION_HINTS,
  };
}

function pushMessage(messages: ChatMessage[], role: ChatMessage['role'], text: string): ChatMessage[] {
  return [
    ...messages,
    { id: newId('msg'), role, text, createdAt: nowIso(), safetyLabel: classifyText(text) },
  ];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboardingComplete: false,
      profile: DEFAULT_PROFILE,
      journey: null,
      plansByDate: {},
      ledger: [],
      streaks: emptyStreaks(),
      evidence: [],
      thoughtRecords: [],
      messages: [],
      safety: CLEAR_SAFETY,

      balance: (): Balance => computeBalance(get().ledger),
      getPlan: (date) => get().plansByDate[date],

      completeOnboarding: (payload) =>
        set((s) => ({
          onboardingComplete: true,
          journey: makeJourney(payload),
          profile: {
            ...s.profile,
            displayName: payload.displayName,
            consents: { ...s.profile.consents, ...payload.consents },
          },
          messages: pushMessage([], 'future', FUTURE_SELF.morning(payload.displayName || undefined)),
        })),

      resetAll: () =>
        set(() => ({
          onboardingComplete: false,
          profile: DEFAULT_PROFILE,
          journey: null,
          plansByDate: {},
          ledger: [],
          streaks: emptyStreaks(),
          evidence: [],
          thoughtRecords: [],
          messages: [],
          safety: CLEAR_SAFETY,
        })),

      setConsent: (key, value) =>
        set((s) => ({ profile: { ...s.profile, consents: { ...s.profile.consents, [key]: value } } })),

      setNotificationPref: (key, value) =>
        set((s) => ({
          profile: { ...s.profile, notifications: { ...s.profile.notifications, [key]: value } },
        })),

      setAccessibilityPref: (key, value) =>
        set((s) => ({
          profile: { ...s.profile, accessibility: { ...s.profile.accessibility, [key]: value } },
        })),

      startMorning: (date) => {
        const s = get();
        if (!s.journey || s.plansByDate[date]) return;
        const goals = buildDailyGoals(GOAL_TEMPLATES, {
          area: s.journey.area,
          energy: 'medium',
          date,
        });
        const plan: DailyPlan = {
          date,
          energy: null,
          goals,
          status: 'draft',
          sentToFutureSelf: false,
        };
        set({ plansByDate: { ...s.plansByDate, [date]: plan } });
      },

      setEnergy: (date, energy) =>
        set((s) => {
          const plan = s.plansByDate[date];
          if (!plan || plan.status !== 'draft' || !s.journey) return {} as Partial<StoreState>;
          const goals = buildDailyGoals(GOAL_TEMPLATES, { area: s.journey.area, energy, date });
          return { plansByDate: { ...s.plansByDate, [date]: { ...plan, energy, goals } } };
        }),

      shrinkGoal: (date, goalId) =>
        set((s) => {
          const plan = s.plansByDate[date];
          if (!plan || plan.status === 'closed') return {} as Partial<StoreState>;
          const target = plan.goals.find((goal) => goal.id === goalId);
          if (!target || target.completed || target.completionCriteria === target.minimumVersion) {
            return {} as Partial<StoreState>;
          }
          const goals = plan.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  completionCriteria: goal.minimumVersion,
                  difficulty: 'gentle' as const,
                  durationMinutes: minimumDurationMinutes(
                    goal.minimumVersion,
                    goal.durationMinutes,
                  ),
                  edited: true,
                }
              : goal,
          );
          return { plansByDate: { ...s.plansByDate, [date]: { ...plan, goals } } };
        }),

      editGoalTitle: (date, goalId, title) =>
        set((s) => {
          const plan = s.plansByDate[date];
          const normalizedTitle = title.trim();
          if (!plan || plan.status !== 'draft' || !normalizedTitle) {
            return {} as Partial<StoreState>;
          }
          const goals = plan.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  title: normalizedTitle,
                  safetyLabel: classifyText(`${normalizedTitle} ${goal.why}`),
                  edited: true,
                }
              : goal,
          );
          return { plansByDate: { ...s.plansByDate, [date]: { ...plan, goals } } };
        }),

      commitPlan: (date) =>
        set((s) => {
          const plan = s.plansByDate[date];
          const hasValidGoals =
            plan?.goals.length === 3 &&
            plan.goals.every((goal) => goal.safetyLabel === 'ok' && goal.title.trim().length > 0);
          if (
            !plan ||
            plan.status !== 'draft' ||
            plan.sentToFutureSelf ||
            !plan.energy ||
            !hasValidGoals ||
            s.safety.suspended
          ) {
            return {} as Partial<StoreState>;
          }
          return {
            ledger: applyEntries(s.ledger, sendThreeEntries(date, nowIso())),
            streaks: recordBond(s.streaks, date),
            messages: pushMessage(
              s.messages,
              'future',
              FUTURE_SELF.morning(s.profile.displayName || undefined),
            ),
            plansByDate: {
              ...s.plansByDate,
              [date]: { ...plan, status: 'committed', sentToFutureSelf: true },
            },
          };
        }),

      completeGoal: (date, goalId) =>
        set((s) => {
          if (s.safety.suspended) return {} as Partial<StoreState>;
          const plan = s.plansByDate[date];
          if (!plan || plan.status !== 'committed' || !plan.sentToFutureSelf) {
            return {} as Partial<StoreState>;
          }
          const goal = plan.goals.find((candidate) => candidate.id === goalId);
          if (!goal || goal.completed) return {} as Partial<StoreState>;

          const completedAt = nowIso();
          const goals = plan.goals.map((candidate) =>
            candidate.id === goalId ? { ...candidate, completed: true, completedAt } : candidate,
          );
          const evidenceItem: Evidence = {
            id: newId('ev'),
            goalId: goal.id,
            date,
            createdAt: completedAt,
            tier: goal.tier,
            title: goal.title,
            durationMinutes: goal.durationMinutes,
          };
          return {
            plansByDate: { ...s.plansByDate, [date]: { ...plan, goals } },
            ledger: applyEntries(s.ledger, completionEntries(goal, date, completedAt)),
            streaks: recordEvidence(s.streaks, date),
            evidence: [evidenceItem, ...s.evidence],
            messages: pushMessage(s.messages, 'future', FUTURE_SELF.onComplete(goal.tier)),
          };
        }),

      saveReflection: (date, reflection) =>
        set((s) => {
          const plan = s.plansByDate[date];
          if (!plan || plan.status !== 'committed' || !plan.sentToFutureSelf) {
            return {} as Partial<StoreState>;
          }
          const label = classifyText(
            `${reflection.didWhat} ${reflection.learned} ${reflection.easierTomorrow}`,
          );
          return {
            plansByDate: {
              ...s.plansByDate,
              [date]: {
                ...plan,
                status: 'closed',
                reflection: { ...reflection, createdAt: nowIso() },
              },
            },
            ...(shouldSuspendGame(label) ? { safety: crisisSafetyState() } : {}),
          };
        }),

      addThoughtRecord: (record) =>
        set((s) => {
          const label = classifyText(thoughtRecordText(record));
          return {
            thoughtRecords: [
              { ...record, id: newId('tr'), createdAt: nowIso() },
              ...s.thoughtRecords,
            ],
            ...(shouldSuspendGame(label) ? { safety: crisisSafetyState() } : {}),
          };
        }),

      sendMessage: (text) => {
        const label = classifyText(text);
        set((s) => {
          let messages = pushMessage(s.messages, 'user', text);

          if (s.safety.suspended || shouldSuspendGame(label)) {
            const safety = crisisSafetyState();
            messages = pushMessage(messages, 'future', safety.message);
            return { messages, safety };
          }

          if (label === 'sensitive') {
            const response = safetyResponse('sensitive');
            if (response) messages = pushMessage(messages, 'future', response.message);
            return { messages };
          }

          messages = pushMessage(
            messages,
            'future',
            'Seni duydum. Bunu bugünün üç küçük adımına çevirelim mi? Önce en küçüğünü seçelim.',
          );
          return { messages };
        });
        return label;
      },

      acknowledgeSafety: () => set(() => ({ safety: CLEAR_SAFETY })),
    }),
    {
      name: 'futureme-store-v1',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        profile: s.profile,
        journey: s.journey,
        plansByDate: s.plansByDate,
        ledger: s.ledger,
        streaks: s.streaks,
        evidence: s.evidence,
        thoughtRecords: s.thoughtRecords,
        messages: s.messages,
      }),
    },
  ),
);

useStore.persist.onFinishHydration(() => {
  useStore.setState({ hydrated: true });
});
if (useStore.persist.hasHydrated()) {
  useStore.setState({ hydrated: true });
}
