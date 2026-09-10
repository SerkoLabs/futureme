# Geliştirme — FutureMe dikey dilim

Bu depo, `README.md`'deki ürün vizyonunun ilk **çalışan dikey dilimidir**: sabah
deneyimi ve üç hedef döngüsü (README "Repo durumu"). Amaç bütün platformu kurmak
değil, çekirdek döngünün gerçekten çalıştığını göstermektir:

**Geleceği hisset → üç köprü seç → gerçek hayatta hareket et → kanıtla → kutla → öğren → yeniden dön.**

> Not: `FutureMe` yalnızca kod adıdır (README bölüm 24). Marka/mağaza/alan adı
> doğrulaması yapılmadan ticari yayına çıkılmamalıdır.

## Teknik yığın

- **Expo SDK 57 + React Native 0.86 + React 19 + TypeScript 6**
- **Expo Router** — dosya tabanlı yönlendirme (`app/`)
- **Zustand + AsyncStorage** — durum ve yerel kalıcılık
- **react-native-svg** — 0–1000 ilerleme halkası
- **Jest + ts-jest** — saf domain (puan/güvenlik/seri) testleri

Teknik sağlayıcılar bilinçli olarak değiştirilebilir tutulmuştur (README bölüm 15);
ürün kuralları modele veya buluta kilitlenmez. Yapay zekâ henüz bağlı değildir;
gelecekteki benlik yanıtları şimdilik güvenli, kural tabanlı bir yedek deneyimdir
(README bölüm 14 — "güvenli yedek deneyim").

## Kurulum ve çalıştırma

```bash
npm install

# Saf domain testleri (puan matematiği + güvenlik + seri) — README bölüm 22
npm run test:domain

# Tüm projeyi tip denetimi
npm run typecheck

# Expo bağımlılık ve yapılandırma kontrolü
npx expo-doctor@latest

# Uygulamayı başlat (cihaz/emülatör/web)
npm run start      # ardından i / a / w
npm run web        # doğrudan web
```

## Android deneme paketi

Proje `@serkandnc/futureme` EAS projesine bağlıdır. Google Play veya Firebase
anahtarı olmadan, cihazda doğrudan kurulabilen iç dağıtım APK'sı üretilebilir:

```bash
npx eas-cli@latest build --platform android --profile preview
```

`preview` profili `eas.json` içinde `distribution: internal` ve `buildType: apk`
olarak tanımlıdır. Üretim mağaza imzası, Google ile giriş ve FCM bildirimleri bu
deneme paketinden ayrıdır; ilgili kimlik bilgileri depoya commit edilmemelidir.

## Klasör yapısı

```
app/                         # Expo Router ekranları
  _layout.tsx                # kök Stack + SafeAreaProvider
  index.tsx                  # giriş kapısı (hydration + onboarding yönlendirmesi)
  onboarding/index.tsx       # gelecekle ilk karşılaşma sihirbazı
  (tabs)/_layout.tsx         # Yol · Konuş · Kanıtlar · Profil
  (tabs)/path.tsx            # ana döngü: üç hedef + ilerleme halkası + yol
  (tabs)/chat.tsx            # Gelecekteki Ben (metin sohbeti)
  (tabs)/evidence.tsx        # Kanıt Kasası
  (tabs)/profile.tsx         # izinler, bildirim, erişilebilirlik, veri kontrolü
  morning.tsx                # sabah deneyimi (enerji + üç hedefi gönder)
  evening.tsx                # Ayna / akşam kapanışı
  thought-lab.tsx            # BDT düşünce kaydı ve davranış deneyi
src/
  theme/                     # renk, tipografi, boşluk (README bölüm 12)
  types/                     # alan tipleri (README bölüm 16 ile hizalı)
  domain/                    # SAF kurallar (puan, seri, güvenlik, tarih, hedef)
    __tests__/               # domain birim testleri
  store/useStore.ts          # Zustand store — olayları domain kurallarına bağlar
  data/seed.ts               # güvenli örnek içerik (yapay zekâ yedeği)
  components/                # paylaşılan UI bileşenleri
docs/DEVELOPMENT.md          # bu dosya
```

## Mimarî ilke: kurallar deterministik koddadır

Kritik puan ve güvenlik kuralları modele/serbest metne bırakılmaz; `src/domain`
içinde saf, test edilebilir fonksiyonlardır (README bölüm 14 ve 17):

- **Puan defteri (`points.ts`)** — bakiye değiştirilebilir değildir; değişmez
  `point_ledger` hareketlerinden hesaplanır. Aynı olay `refId` ile idempotenttir;
  çevrimdışı/yeniden senkron çift puan üretmez.
- **Ekonomi (`economy.ts`)** — kademe puanları ve 180 gün / 1000 AŞAMA matematiği
  (azami 1260, ortalama ~5,56, tutarlılık ~%79, en az 143 tam gün).
- **Seri (`streak.ts`)** — Bağ ve Kanıt serileri; kaçırılan gün geçmiş yolu silmez.
- **Güvenlik (`safety.ts`)** — kriz sinyalinde `shouldSuspendGame` oyun dilini ve
  puan akışını durdurur; kullanıcı gerçek destek kaynaklarına yönlendirilir. Bu bir
  tanı aracı değildir; kaba, yüksek-hassasiyetli bir kapıdır.

## Kabul kriterleriyle eşleme (README bölüm 22)

| Kabul kriteri | Nerede |
|---|---|
| Aynı gün en fazla üç aktif hedef | `buildDailyGoals` her kademeden bir tane üretir |
| Her hedefin tamamlanma ölçütü + minimum sürümü | `DailyGoal.completionCriteria` / `minimumVersion` |
| AŞAMA yalnızca doğrulanmış olaydan bir kez | `applyEntries` idempotency (`points.test.ts`) |
| 180 günlük puan matematiği tutarlı | `journeyMath` (`economy.test.ts`) |
| Kaçırılan gün kazanımı silmez | `streak.ts` + defter değişmezliği |
| Kriz sinyalinde ödül/oyun dili devre dışı | `shouldSuspendGame` + store `completeGoal` guard |
| Enerji seçilmeden plan gönderilemez | `commitPlan` store guard + sabit sabah CTA'sı |
| Gönderilmemiş hedef puanlanamaz | `completeGoal` committed/sent guard |
| Çevrimdışı tamamlama çift puan üretmez | `completionRefId` idempotency |
| Bildirim/hafıza/foto/ses ayrı ayrı kapatılabilir | Profil ekranı + `consents`/`notifications` |
| Yerel veriyi dışa aktarma | Profil ekranındaki sistem paylaşım menüsü üzerinden JSON |
| Hesap silme | `resetAll` (üretimde türetilmiş medyayı da kapsayacak) |

## Bilinçli sınırlar (bu dilimde yok)

Gerçek zamanlı ses, ses klonlama, foto-gerçekçi yaşlandırma, giyilebilir cihaz
entegrasyonu ve yapay zekâ bağlantısı beta sonrasına bırakılmıştır (README bölüm 19).
Lisanslı kitap içeriği kopyalanmaz; içerik havuzu klinik incelemeyle özgün yazılır
(README bölüm 10).
