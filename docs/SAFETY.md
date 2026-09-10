# FutureMe güvenlik durumları

Bu belge, ürün vizyonundaki güvenlik sınırlarının çalışan dikey dilimde nasıl uygulanacağını tanımlar.

## Durumlar

| Durum | Tetikleyici | Oyun ve puan | Yanıt davranışı |
|---|---|---|---|
| `ok` | Olağan kullanıcı metni | Açık | Küçük, uygulanabilir adıma yönlendir |
| `sensitive` | Yeme düzeni, tehlikeli kısıtlama veya beden takıntısı sinyali | Açık; beden hedefleri önerilmez | Beden-nötr dil ve uzman desteği önerisi |
| `crisis` | Kendine zarar, intihar veya akut kriz sinyali | Askıya alınır | Gerçek ve yerel destek kaynaklarına yönlendir |

## Değişmez kurallar

1. Kriz durumu açıkken sonraki sıradan mesaj oyunu yeniden başlatmaz.
2. Plan gönderme ve hedef tamamlama kriz durumunda puan üretmez.
3. Sohbet, hedef başlığı, akşam yansıması ve Düşünce Laboratuvarı metinleri aynı deterministik kapıdan geçer.
4. Kullanıcı tarafından düzenlenen hedefin güvenlik etiketi yeniden hesaplanır.
5. Güvenlik sınıflandırıcısı tanı aracı değildir; yalnızca ürün davranışını güvenli moda geçirir.
6. Üretimde yerel anahtar sözcük katmanı tek başına yeterli değildir; doğrulanmış model tabanlı sınıflandırma, ülkeye göre kaynak yapılandırması ve olay izleme ile katmanlanmalıdır.

## Birleştirme kontrolleri

Her pull request şu kontrolleri geçmelidir:

- TypeScript tip denetimi
- Domain testleri
- Expo web export

Mobil cihaz smoke testi ayrıca şu akışları kapsamalıdır:

- onboarding → enerji seçimi → üç hedefi gönderme
- hedefi bir kez küçültme ve tekrar küçültmede değişmezlik
- hedef tamamlama ve tek sefer puan yazımı
- kriz mesajı → oyun/puan askısı → sonraki mesajda güvenli modun korunması
- hassas beden/yeme mesajı → beden-nötr yanıt
