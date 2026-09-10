import {
  classifyText,
  normalize,
  safetyResponse,
  shouldSuspendGame,
} from '../safety';

describe('guvenlik siniflandirici (README bolum 14 ve 17)', () => {
  it('kriz sinyalini yakalar ve oyun dilini askiya alir', () => {
    const label = classifyText('artik yasamak istemiyorum');
    expect(label).toBe('crisis');
    expect(shouldSuspendGame(label)).toBe(true);
  });

  it('Turkce karakterli kriz ifadesini normalize ederek yakalar', () => {
    expect(classifyText('İntihar etmeyi düşünüyorum')).toBe('crisis');
  });

  it('hassas beden/yeme sinyalini isaretler ama oyunu durdurmaz', () => {
    const label = classifyText('gunlerdir ac kalarak kilo vermeye calisiyorum');
    expect(label).toBe('sensitive');
    expect(shouldSuspendGame(label)).toBe(false);
  });

  it('siradan metni ok olarak birakir', () => {
    const label = classifyText('bugun 25 dakika ders calisacagim');
    expect(label).toBe('ok');
    expect(shouldSuspendGame(label)).toBe(false);
  });

  it('normalize Turkce harfleri sadelestirip bosluklari toplar', () => {
    expect(normalize('  İNTİHAR   Şey  ')).toBe('intihar sey');
  });

  it('kriz yaniti bagimlilik kuran "kimseye soyleme" dili URETMEZ', () => {
    const res = safetyResponse('crisis');
    expect(res).not.toBeNull();
    expect(res!.suspendGame).toBe(true);
    const text = normalize(`${res!.title} ${res!.message}`);
    expect(text).not.toContain('kimseye soyleme');
    expect(text).not.toContain('benimle kal');
    expect(res!.resources.some((r) => r.value.includes('112'))).toBe(true);
  });

  it('ok etiketinde guvenlik yaniti gerekmez', () => {
    expect(safetyResponse('ok')).toBeNull();
  });
});
