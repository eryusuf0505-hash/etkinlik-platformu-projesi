# ETKİNLİK & TOPLULUK PLATFORMU - TAM PROJESİ AÇIKLAMASI (A'DAN Z'YE)

## PROJE ÖZETİ

Bu proje, Next.js + MongoDB ile yapılmış, insanları etkinliklere katılmaya ve topluluk oluşturmaya yardımcı olan modern bir platformdur. Türkiye'de etkinlik keşfetme ve sosyal ağ oluşturmanın en kolay yoludur.

---

## SISTEM MİMARİSİ (Architecture)

Proje 4 katmanlı mimari kullanıyor:

PRESENTATION LAYER (UI) ← Kullanıcı arayüzü (React/Next.js)
         ↓
API LAYER ← HTTP İstekleri (/api/...)
         ↓
BUSINESS LOGIC LAYER ← Manager & Service sınıfları
         ↓
DATA ACCESS LAYER ← Repository (Veritabanı işlemleri)
         ↓
DATABASE LAYER ← MongoDB Veritabanı

---

## ANA SAYFALAR & ÖZELLIKLERI

### ANASAYFA (src/app/page.jsx)

- Görüntü: Renkli gradient arka plan, hero section
- Butonlar:
  * "Etkinlikleri Keşfet" → /kesfet sayfasına gider
  * "Topluluklara Katıl" → /topluluklar sayfasına gider
- 3 Öne Çıkan Özellik:
  * 🎫 Eşsiz Etkinlikler
  * 🤝 Güçlü Topluluklar
  * 🗓️ Kişisel Takvim

---

## KULLANICI YÖNETİMİ (Authentication & Users)

### Kullanıcı Modeli (User.model.js)

Veritabanında Kullanıcı Bilgileri:
- name: String - Kullanıcı adı
- email: String - E-posta (unique, hiçbir zaman tekrarlanamaz)
- password: String - Şifrelenmiş şifre (Bcrypt ile 10 salt round)
- role: 'user' | 'admin' - Kullanıcı tipi
- city: String - Şehir
- bio: String - Biyografi
- profileImage: String - Profil fotoğrafı URL
- joinedCommunities: Array - Katıldığı topluluklar
- resetOtp: String - Şifre sıfırlama kodu (6 haneli)
- resetOtpExpiry: Date - Şifre sıfırlama kodunun son kullanma tarihi
- aktif_mi: Boolean - Hesap aktif mi?
- silindi_mi: Boolean - Soft delete için
- olusturulma_tarihi: Date - Hesap oluşturma tarihi
- guncellenme_tarihi: Date - Son güncelleme tarihi

### KİMLİK DOĞRULAMA (Authentication) AKIŞI

#### 1. KAYIT (Register) - POST /api/auth/register

İstek:
{
  name: "Ali Yılmaz",
  email: "ali@example.com",
  password: "12345678"
}

Dönen Yanıt:
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "507f1f77bcf86cd799439011",
    name: "Ali Yılmaz",
    email: "ali@example.com",
    role: "user"
  }
}

Neler Oluyor?
1. Email veritabanında kontrol edilir (unique olmalı)
2. Şifre Bcrypt ile şifrelenir (10 salt round)
3. Yeni kullanıcı database'e kaydedilir
4. JWT token oluşturulur (7 gün geçerli)
5. Token ve kullanıcı bilgileri döndürülür
6. Frontend localStorage'a token'ı kaydeder

#### 2. GİRİŞ (Login) - POST /api/auth/login

İstek:
{
  email: "ali@example.com",
  password: "12345678"
}

Dönen Yanıt:
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "507f1f77bcf86cd799439011",
    name: "Ali Yılmaz",
    email: "ali@example.com",
    role: "user"
  }
}

Neler Oluyor?
1. Email'e göre kullanıcı database'de aranır
2. Kullanıcı bulunmazsa "E-posta veya şifre hatalı" hatası döner
3. Şifre Bcrypt ile database şifresi ile karşılaştırılır
4. Eğer eşleşmezse "E-posta veya şifre hatalı" hatası döner
5. Eğer eşleşirse JWT token oluşturulur
6. Token döndürülür

#### 3. ŞIFRA SIFIRLAMA

ADIM 1: POST /api/auth/forgot-password
İstek: { email: "ali@example.com" }
Neler Oluyor:
1. Email'e göre kullanıcı bulunur
2. 6 haneli random OTP kodu oluşturulur
3. Bu OTP database'e kaydedilir ve kullanıcının e-postasına gönderilir
4. OTP 15 dakika geçerlidir

ADIM 2: POST /api/auth/reset-password
İstek:
{
  email: "ali@example.com",
  otp: "123456",
  newPassword: "yeni_sifre_123"
}

Dönen Yanıt:
{
  message: "Şifreniz başarıyla güncellendi."
}

Neler Oluyor?
1. Email'e göre kullanıcı bulunur
2. OTP kontrol edilir (doğru mu? Süresi dolmadı mı?)
3. Eğer OTP hatalı veya süresi dolmuşsa hata döner
4. Yeni şifre Bcrypt ile şifrelenir
5. Database'deki şifre güncellenir
6. OTP silinir

#### 4. BANA BİLGİ SOR (Me) - GET /api/auth/me

Başlık:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Dönen Yanıt:
{
  user: {
    id: "507f1f77bcf86cd799439011",
    name: "Ali Yılmaz",
    email: "ali@example.com",
    role: "user",
    city: "İstanbul",
    bio: "Yazılım geliştirme hoşlanıyorum",
    joinedCommunities: ["com1", "com2", "com3"],
    stats: {
      eventCount: 5,        // Katıldığı etkinlik sayısı
      communityCount: 3,    // Katıldığı topluluk sayısı
      ticketCount: 5,       // Satın aldığı bilet sayısı
      favoriteCount: 0      // Favori etkinlik sayısı
    }
  }
}

Neler Oluyor?
1. Authorization header'ından JWT token alınır
2. Token doğrulanır (JWT_SECRET ile)
3. Token'dan kullanıcı ID alınır
4. Veritabanından kullanıcı bilgileri getirilir
5. Topluluklar populate edilir
6. İstatistikler hesaplanır
7. Kullanıcı bilgileri döndürülür

#### 5. GÜVENLİK (Auth Middleware)

Her İstek Akışı:
1. İstek gelir: Authorization: Bearer TOKEN
2. verifyToken() fonksiyonu çağrılır
3. Authorization header'ı kontrol edilir
4. Token Format kontrolü: Bearer TOKEN formatında mı?
5. JWT Token doğrulanması: JWT_SECRET ile verify edilir
6. Eğer başarısız ise 401 Unauthorized hatası döner
7. Eğer başarılı ise kullanıcı bilgileri request'e eklenir
8. endpoint devam eder

Hata Kodları:
- 401 Unauthorized: Token yok, geçersiz veya süresi dolmuş
- 403 Forbidden: Yetkiniz yok
- 400 Bad Request: Hatalı istek

Token Süresi: 7 gün

---

## ETKİNLİK YÖNETİMİ (Event Management)

### Etkinlik Modeli (Event.model.js)

Veritabanında Etkinlik Bilgileri:
- title: String - Etkinlik adı (örn: "Yazılım Konferansı 2024")
- description: String - Detaylı açıklama
- category: ObjectId - Kategori (ref: Category) (örn: "Teknoloji", "Müzik", "Spor")
- city: String - Şehir (örn: "İstanbul", "Ankara", "İzmir")
- address: String - Adresi (örn: "Türkmen Teknopolis")
- date: Date - Etkinlik tarihi ve saati (örn: "2024-06-15T14:00:00Z")
- imageUrl: String - Etkinlik görseli URL
- organizer: ObjectId - Düzenleyen kişi (ref: User)
- community: ObjectId - Bağlı topluluk (ref: Community)
- capacity: Number - Maksimum katılımcı sayısı (örn: 500)
- price: Number - Bilet fiyatı (0 = Ücretsiz)
- bankAccount: String - Ödeme hesabı IBAN
- is_new: Boolean - Yeni etkinlik mi?
- aktif_mi: Boolean - Etkinlik aktif mi?
- silindi_mi: Boolean - Soft delete için
- olusturulma_tarihi: Date - Oluşturulma tarihi
- guncellenme_tarihi: Date - Güncellenme tarihi

### ETKİNLİK İŞLEMLERİ

#### 1. TÜM ETKİNLİKLERİ LİSTELE - GET /api/events

Sorgu Parametreleri:
- page=1 (Sayfa numarası)
- limit=10 (Sayfada kaç etkinlik)
- category=musik (Kategori filtresi)
- city=İstanbul (Şehir filtresi)
- startDate=2024-05-01 (Başlangıç tarihi)
- endDate=2024-05-31 (Bitiş tarihi)
- sort={"date":1} (Sıralama: 1=Artan, -1=Azalan)

İstek Örneği:
GET /api/events?page=1&limit=10&category=musik&city=İstanbul

Dönen Yanıt:
{
  data: [
    {
      id: "507f1f77bcf86cd799439011",
      title: "Konser - Gülşen",
      description: "Ünlü sanatçı Gülşen ile konser",
      date: "2024-06-15T20:00:00Z",
      city: "İstanbul",
      address: "Vatan Kültür ve Turizm Merkezi",
      price: 150,
      capacity: 2000,
      category: {
        id: "cat1",
        name: "Müzik",
        slug: "muzik",
        icon: "🎵"
      },
      organizer: {
        id: "user1",
        name: "Sanat Müşteri",
        email: "sanat@example.com",
        profileImage: "https://..."
      },
      imageUrl: "https://...",
      is_new: true
    },
    {
      id: "507f1f77bcf86cd799439012",
      title: "Yazılım Konferansı",
      description: "Türkiye'nin en büyük yazılım konferansı",
      date: "2024-07-10T09:00:00Z",
      city: "Ankara",
      address: "Ankara Hilton",
      price: 250,
      capacity: 1500,
      category: {
        id: "cat2",
        name: "Teknoloji",
        slug: "teknoloji",
        icon: "💻"
      },
      organizer: {
        id: "user2",
        name: "Tech Org",
        email: "tech@example.com"
      },
      imageUrl: "https://..."
    }
  ],
  pagination: {
    total: 150,      // Toplam etkinlik sayısı
    page: 1,         // Mevcut sayfa
    limit: 10,       // Sayfada kaç sonuç
    totalPages: 15   // Toplam sayfa sayısı
  }
}

Filtreleme Özellikleri:
- Kategoriye göre filtrele (musik, spor, teknoloji, sanat vb.)
- Şehre göre filtrele (İstanbul, Ankara, İzmir vb.)
- Tarih aralığına göre filtrele (başlangıç ve bitiş tarihi)
- Sırala (tarihe göre, popülarite göre, fiyata göre)
- Sayfalama (her sayfada 10, 20, 50 vb. etkinlik)

#### 2. YENİ ETKİNLİK OLUŞTUR - POST /api/events

Başlık:
Authorization: Bearer TOKEN

İstek:
{
  title: "Yazılım Konferansı 2024",
  description: "Türkiye'nin en büyük yazılım konferansı. Ünlü yazılımcı ve girişimcilerin konuşması.",
  category: "Teknoloji",
  city: "Ankara",
  address: "Ankara Hilton Otel, Ankara",
  date: "2024-06-15T14:00:00Z",
  imageUrl: "https://example.com/image.jpg",
  capacity: 500,
  price: 100,
  bankAccount: "TR123456789..."
}

Dönen Yanıt:
{
  id: "507f1f77bcf86cd799439013",
  title: "Yazılım Konferansı 2024",
  description: "Türkiye'nin en büyük yazılım konferansı...",
  category: "cat3",
  city: "Ankara",
  address: "Ankara Hilton Otel",
  date: "2024-06-15T14:00:00Z",
  organizer: "user3",  // Giriş yapan kişinin ID'si
  capacity: 500,
  price: 100,
  is_new: true,
  olusturulma_tarihi: "2024-05-01T10:00:00Z"
}

Kurallar:
- Sadece ADMIN kullanıcılar etkinlik oluşturabilir
- Eğer regular user oluşturmaya çalışırsa 403 Forbidden hatası döner
- Kategori otomatik oluşturulur (yoksa)
- Etkinliğin düzenleyeni (organizer) giriş yapan kişi olur

Hata Durumları:
- 401 Unauthorized: Token yok veya geçersiz
- 403 Forbidden: Admin değilsiniz
- 400 Bad Request: Zorunlu alanlar eksik

#### 3. ETKİNLİK DETAYı - GET /api/events/[id]

İstek:
GET /api/events/507f1f77bcf86cd799439013

Dönen Yanıt:
{
  id: "507f1f77bcf86cd799439013",
  title: "Yazılım Konferansı 2024",
  description: "Türkiye'nin en büyük yazılım konferansı. Ünlü yazılımcı ve girişimcilerin konuşması.",
  category: {
    id: "cat3",
    name: "Teknoloji",
    slug: "teknoloji",
    icon: "💻"
  },
  organizer: {
    id: "user3",
    name: "Ahmet Yazılımcı",
    email: "ahmet@example.com",
    city: "Ankara",
    profileImage: "https://..."
  },
  community: {
    id: "com1",
    name: "Tech Community Turkey",
    memberCount: 1500
  },
  date: "2024-06-15T14:00:00Z",
  city: "Ankara",
  address: "Ankara Hilton Otel",
  capacity: 500,
  price: 100,
  imageUrl: "https://example.com/image.jpg",
  bankAccount: "TR123456789...",
  is_new: true
}

#### 4. ETKİNLİĞİ GÜNCELLE - PATCH /api/events/[id]

Başlık:
Authorization: Bearer TOKEN

İstek:
{
  title: "Yazılım Konferansı 2024 - AÇILDI!",
  price: 125,
  capacity: 600
}

Dönen Yanıt:
{
  id: "507f1f77bcf86cd799439013",
  title: "Yazılım Konferansı 2024 - AÇILDI!",
  price: 125,
  capacity: 600,
  ... (diğer alanlar aynı)
}

Kurallar:
- Sadece ETKINLIĞIN DÜZENLEYENİ veya ADMİN güncelleyebilir
- Başka biri güncellemek isterse 403 Forbidden hatası döner
- Kısmi güncelleme yapılabilir (tüm alanları göndermek zorunda değilsiniz)

#### 5. ETKİNLİĞİ SİL - DELETE /api/events/[id]

Başlık:
Authorization: Bearer TOKEN

İstek:
DELETE /api/events/507f1f77bcf86cd799439013

Dönen Yanıt:
{
  message: "Etkinlik başarıyla silindi."
}

Kurallar:
- Sadece ETKİNLİĞİN DÜZENLEYENİ veya ADMİN silebilir
- Soft delete yapılır (silindi_mi: true)
- Veritabanından tamamen silinmez
- Veriler arşivlenir

### KATILIMCILAR (Participant.model.js)

Veritabanında Katılımcı Bilgileri:
- event: ObjectId - Hangi etkinliğe katıldığı (ref: Event)
- user: ObjectId - Katılan kişi (ref: User)
- status: 'joined' | 'cancelled' | 'pending' - Katılım durumu
  * 'joined' = Etkinliğe katıldı
  * 'cancelled' = Katılımdan vazgeçti
  * 'pending' = Onay bekliyor
- createdAt: Date - Katılım tarihi
- updatedAt: Date - Son güncellenme tarihi

Tekil Katılım Kuralı:
- Bir kişi aynı etkinliğe iki kez katılamaz
- Database'de unique index var: { event: 1, user: 1 }

---

## TOPLULUK YÖNETİMİ (Community Management)

### Topluluk Modeli (Community.model.js)

Veritabanında Topluluk Bilgileri:
- name: String - Topluluk adı (unique, tekrarlanamaz)
- description: String - Topluluk açıklaması
- category: String - Kategori (müzik, spor, teknoloji, sanat, öğrenci, vb.)
- icon: String - Emoji ikon (örn: "🎵", "⚽", "💻")
- memberCount: Number - Topluluk üye sayısı
- owner: ObjectId - Topluluk kurucusu/sahibi (ref: User)
- members: [ObjectId] - Tüm topluluk üyeleri listesi (ref: User)
- aktif_mi: Boolean - Topluluk aktif mi?
- silindi_mi: Boolean - Soft delete için
- olusturulma_tarihi: Date - Oluşturulma tarihi
- guncellenme_tarihi: Date - Güncellenme tarihi

### TOPLULUK İŞLEMLERİ

#### 1. TÜM TOPLULUKLAR - GET /api/communities

Sorgu Parametreleri:
- category=musik (Kategori filtresi)
- search=jazz (Arama filtresi)

İstek Örneği:
GET /api/communities?category=musik&search=jazz

Dönen Yanıt:
{
  data: [
    {
      id: "com1",
      name: "Jazz Severleri Türkiye",
      category: "Müzik",
      description: "Jazz müziğini seven insanlar için platformu",
      icon: "🎷",
      memberCount: 234,
      owner: {
        id: "user4",
        name: "Fatih Müzik",
        email: "fatih@example.com",
        profileImage: "https://..."
      },
      members: ["user4", "user5", "user6", ...],
      olusturulma_tarihi: "2024-01-15T10:00:00Z"
    },
    {
      id: "com2",
      name: "Modern Jazz Fans",
      category: "Müzik",
      description: "Modern jazz sanat biçimini sevenlerin grubu",
      icon: "🎷",
      memberCount: 156,
      owner: {
        id: "user7",
        name: "Ayşe Sanat",
        email: "ayse@example.com"
      },
      members: ["user7", "user8", "user9", ...],
      olusturulma_tarihi: "2024-02-20T14:00:00Z"
    }
  ],
  pagination: {
    total: 45,
    page: 1,
    limit: 10,
    totalPages: 5
  }
}

#### 2. YENİ TOPLULUK OLUŞTUR - POST /api/communities

Başlık:
Authorization: Bearer TOKEN

İstek:
{
  name: "Python Geliştirici Grubu",
  description: "Python ile yazılım geliştiren geliştirici grubu. Django, Flask, FastAPI hakkında paylaşım yapıyoruz.",
  category: "Teknoloji",
  icon: "🐍"
}

Dönen Yanıt:
{
  id: "com3",
  name: "Python Geliştirici Grubu",
  description: "Python ile yazılım geliştiren geliştirici grubu...",
  category: "Teknoloji",
  icon: "🐍",
  owner: "user8",  // Giriş yapan kişinin ID'si
  members: ["user8"],  // Kurucusu otomatik üye olur
  memberCount: 1,
  olusturulma_tarihi: "2024-05-01T11:00:00Z"
}

Kurallar:
- Sadece ADMİN topluluk oluşturabilir
- Regular user oluşturmak isterse 403 Forbidden hatası döner
- Kurucusu otomatik olarak ilk üye olur
- Name alanı unique olmalı (iki topluluk aynı adla olamaz)

#### 3. TOPLULUK DETAYı - GET /api/communities/[id]

İstek:
GET /api/communities/com3

Dönen Yanıt:
{
  id: "com3",
  name: "Python Geliştirici Grubu",
  description: "Python ile yazılım geliştiren geliştirici grubu...",
  category: "Teknoloji",
  icon: "🐍",
  memberCount: 1,
  owner: {
    id: "user8",
    name: "Mert Yazılım",
    email: "mert@example.com",
    profileImage: "https://..."
  },
  members: [
    {
      id: "user8",
      name: "Mert Yazılım",
      email: "mert@example.com"
    }
  ],
  olusturulma_tarihi: "2024-05-01T11:00:00Z"
}

Kurallar:
- Herkes topluluk detayını görebilir (koruma yok)
- Üye olmadan da detayları okuyabilir

#### 4. TOPLULUK GÜNCELLE - PATCH /api/communities/[id]

Başlık:
Authorization: Bearer TOKEN

İstek:
{
  description: "Python ile yazılım geliştiren geliştiriciler için harika bir gruptur!",
  icon: "🔥"
}

Dönen Yanıt:
{
  id: "com3",
  name: "Python Geliştirici Grubu",
  description: "Python ile yazılım geliştiren geliştiriciler için harika bir gruptur!",
  icon: "🔥",
  ... (diğer alanlar)
}

Kurallar:
- Sadece TOPLULUK SAHİBİ veya ADMİN güncelleyebilir
- Başka biri güncellemek isterse 403 Forbidden hatası döner

#### 5. TOPLULUK SİL - DELETE /api/communities/[id]

Başlık:
Authorization: Bearer TOKEN

İstek:
DELETE /api/communities/com3

Dönen Yanıt:
{
  message: "Topluluk başarıyla silindi."
}

Kurallar:
- Sadece TOPLULUK SAHİBİ veya ADMİN silebilir
- Soft delete yapılır (silindi_mi: true)
- Topluluk tamamen silinmez, sadece gizlenir

#### 6. TOPLULUĞA KATIL - POST /api/communities/join

Başlık:
Authorization: Bearer TOKEN

İstek:
{
  communityId: "com3"
}

Dönen Yanıt:
{
  message: "Topluluğa başarıyla katıldınız."
}

Neler Oluyor?
1. Giriş yapan kullanıcı kontrol edilir
2. Topluluk ID'si kontrol edilir
3. Kullanıcı zaten topluluğa üye mi diye kontrol edilir
4. Eğer zaten üyeyse "Zaten bu topluluktasınız" mesajı döner
5. İki taraflı güncelleme yapılır:
   - Kullanıcının joinedCommunities listesine topluluk eklenir
   - Topluluğun members listesine kullanıcı eklenir
   - memberCount 1 artırılır
6. İki listede de veritabanı güncellenir
7. Başarı mesajı döner

Kurallar:
- Aynı topluluğa iki kez katılamaz (tek kez kontrol)
- Herkes katılabilir

---

## MESAJLAŞMA SİSTEMİ (Messaging System)

### Mesaj Modeli (Message.model.js)

Veritabanında Mesaj Bilgileri:
- community: ObjectId - Hangi topluluğun mesajı (ref: Community)
- user: ObjectId - Mesajı kimin yazdığı (ref: User)
- text: String - Mesaj metni
- aktif_mi: Boolean - Mesaj aktif mi?
- silindi_mi: Boolean - Soft delete için
- olusturulma_tarihi: Date - Gönderme zamanı
- guncellenme_tarihi: Date - Son güncellenme zamanı

### MESAJ İŞLEMLERİ

#### 1. TOPLULUK MESAJLARI - GET /api/communities/[id]/messages

İstek:
GET /api/communities/com3/messages

Dönen Yanıt:
[
  {
    id: "msg1",
    text: "Merhaba herkese! Bu Python grubu harika!",
    user: {
      id: "user8",
      name: "Mert Yazılım",
      profileImage: "https://...",
      role: "admin"
    },
    community: "com3",
    olusturulma_tarihi: "2024-05-01T12:00:00Z"
  },
  {
    id: "msg2",
    text: "Hoşgeldin Mert! Senin Django tutoriallarını severim.",
    user: {
      id: "user9",
      name: "Zeynep Dev",
      profileImage: "https://...",
      role: "user"
    },
    community: "com3",
    olusturulma_tarihi: "2024-05-01T12:05:00Z"
  },
  {
    id: "msg3",
    text: "Birisi FastAPI hakkında bir soru sorabilir mi?",
    user: {
      id: "user10",
      name: "Can Geliştirici",
      profileImage: "https://...",
      role: "user"
    },
    community: "com3",
    olusturulma_tarihi: "2024-05-01T12:15:00Z"
  }
]

Özellikler:
- Tüm mesajlar tarih sırasına göre listelenir
- Kullanıcı bilgileri populate edilir (isim, profil resmi, rol)
- Silinen mesajlar gösterilmez
- En fazla 100 mesaj döner (varsayılan limit)

#### 2. MESAJ GÖNDER - POST /api/communities/[id]/messages

Başlık:
Authorization: Bearer TOKEN

İstek:
{
  text: "Merhaba herkese! Bu harika bir topluluk!"
}

Dönen Yanıt:
{
  id: "msg4",
  text: "Merhaba herkese! Bu harika bir topluluk!",
  user: {
    id: "user11",
    name: "Fatih Koder",
    profileImage: "https://...",
    role: "user"
  },
  community: "com3",
  olusturulma_tarihi: "2024-05-01T12:20:00Z"
}

Kurallar:
- Mesaj boş olamaz
- Mesaj 1000 karakteri aşamaz (opsiyonel)
- Kullanıcı topluluğa üye olmasa da mesaj gönderebilir

Hata Durumları:
- 401 Unauthorized: Giriş yapılmamış
- 400 Bad Request: Mesaj metni boş
- 404 Not Found: Topluluk bulunamadı

#### 3. MESAJ SİL - DELETE /api/messages/[id]

Başlık:
Authorization: Bearer TOKEN

İstek:
DELETE /api/messages/msg4

Dönen Yanıt:
{
  message: "Mesaj başarıyla silindi."
}

Kurallar:
- Sadece MESAJ SAHİBİ veya ADMİN silebilir
- Başka biri silmek isterse 403 Forbidden hatası döner
- Soft delete yapılır (silindi_mi: true)

---

## KATEGORİ YÖNETİMİ (Category Management)

### Kategori Modeli (Category.model.js)

Veritabanında Kategori Bilgileri:
- name: String - Kategori adı (unique) (örn: "Müzik", "Spor", "Teknoloji")
- slug: String - URL-friendly adı (unique) (örn: "muzik", "spor", "teknoloji")
- icon: String - Emoji ikon (örn: "🎵", "⚽", "💻")
- isDeleted: Boolean - Silinmiş mi?
- createdAt: Date - Oluşturulma tarihi
- updatedAt: Date - Güncellenme tarihi

### KATEGORİ İŞLEMLERİ

#### 1. TÜM KATEGORİLER - GET /api/categories

İstek:
GET /api/categories

Dönen Yanıt:
{
  data: [
    {
      id: "cat1",
      name: "Müzik",
      slug: "muzik",
      icon: "🎵"
    },
    {
      id: "cat2",
      name: "Spor",
      slug: "spor",
      icon: "⚽"
    },
    {
      id: "cat3",
      name: "Teknoloji",
      slug: "teknoloji",
      icon: "💻"
    },
    {
      id: "cat4",
      name: "Sanat",
      slug: "sanat",
      icon: "🎨"
    },
    {
      id: "cat5",
      name: "Eğitim",
      slug: "egitim",
      icon: "📚"
    }
  ],
  pagination: {
    total: 5,
    page: 1,
    limit: 100,
    totalPages: 1
  }
}

Özellikler:
- Kategoriler alfabetik sıraya göre listelenir
- Silinmiş kategoriler gösterilmez
- Herkes erişebilir (koruma yok)

#### 2. YENİ KATEGORİ OLUŞTUR - POST /api/categories

Başlık:
Authorization: Bearer TOKEN (SADECE ADMIN)

İstek:
{
  name: "Yazılım Geliştirme",
  icon: "💻"
}

Dönen Yanıt:
{
  id: "cat6",
  name: "Yazılım Geliştirme",
  slug: "yazilim-gelistirme",
  icon: "💻"
}

Kurallar:
- Sadece ADMİN kategori oluşturabilir
- Name alanı unique olmalı
- Slug otomatik oluşturulur (name'den)
- Name'de Türkçe karakter desteği var

---

## ÖDEME SİSTEMİ (Payment System)

### Siparişler (Order.model.js)

Veritabanında Sipariş Bilgileri:
- user: ObjectId - Alıcı (ref: User)
- event: ObjectId - Hangi etkinliğin bileti (ref: Event)
- amount: Number - Ödeme tutarı (örn: 250 TRY)
- currency: String - Para birimi (TRY, USD, EUR, vb.) (Varsayılan: TRY)
- paymentStatus: String - Ödeme durumu
  * 'pending' = Ödeme bekleniyor
  * 'completed' = Ödeme tamamlandı
  * 'failed' = Ödeme başarısız
- paymentMethod: String - Ödeme yöntemi
  * 'credit_card' = Kredi kartı
  * 'apple_pay' = Apple Pay
  * 'google_pay' = Google Pay
  * 'crypto' = Kripto para
- transactionId: String - Ödeme sağlayıcısının işlem ID'si
- createdAt: Date - Sipariş oluşturma tarihi
- updatedAt: Date - Son güncellenme tarihi

NOT: Ödeme işlemleri henüz tam entegre değildir. Altyapı hazır fakat gerçek ödeme bağlantıları (Stripe, PayPal, iyzico) yapılmamıştır.

---

## SAYFALAR & ROTALAR (Pages & Routes)

### AÇIK SAYFALAR (Oturum açılmadan erişilebilir)

1. ANASAYFA (/)
   - Renkli gradient arka plan
   - Hero section
   - "Etkinlikleri Keşfet" butonu
   - "Topluluklara Katıl" butonu
   - 3 öne çıkan özellik kartu

2. GİRİŞ (/login)
   - E-posta girdisi
   - Şifre girdisi
   - "Giriş Yap" butonu
   - "Şifremi Unuttum" linki
   - "Üye Ol" linki

3. KAYIT (/register)
   - İsim girdisi
   - E-posta girdisi
   - Şifre girdisi
   - Şifre tekrarı girdisi
   - "Kayıt Ol" butonu
   - "Zaten hesabım var" linki

### KORUMALÜ SAYFALAR (Oturum açılması zorunlu)

#### KEŞFET PANEL (/kesfet)

Özellikler:
- Tüm etkinlikleri listele (sayfalı)
- Kategoriye göre filtrele (dropdown)
- Şehre göre filtrele (dropdown/search)
- Tarihe göre filtrele (date picker)
- Fiyata göre filtrele (price range)
- Arama yap (etkinlik adı)
- Her etkinliğe tıklayarak detayları gör
- "Katıl" butonu ile etkinliğe katıl
- Etkinliğe katılırsa Participant kaydı oluşturulur

Görüntü Öğeleri:
- Etkinlik görseli (imageUrl)
- Etkinlik adı (title)
- Kategori badge'i
- Tarih ve saat
- Şehir
- Fiyat
- Katılımcı sayısı

#### TOPLULUKLAR (/topluluklar)

Özellikler:
- Tüm toplulukları listele
- Kategori filtresi
- Arama yapabilir (topluluk adı)
- Her topluluğu tıklanabilir
- "Katıl" butonu ile topluluğa katıl
- Üyesidir mi kontrolü (katıldı mı?)

Görüntü Öğeleri:
- Topluluk ikon'u (icon)
- Topluluk adı (name)
- Kategori
- Üye sayısı (memberCount)
- Kurucunun adı
- Açıklama (description)

#### TOPLULUK DETAYı (/topluluklar/[id])

Özellikler:
- Topluluk bilgileri
- Topluluk açıklaması
- Üye listesi
- Üye sayısı
- Topluluk mesajları (live chat)
- Mesaj gönder formu
- Mesajları listele
- Eski mesajları sil (kurucusu veya admin)

Bölümler:
1. Başlık Bölümü
   - Topluluk adı
   - İcon
   - Kategori
   - Üye sayısı
   - Açıklama

2. Üyeler Bölümü
   - Üyelerin listesi
   - Her üyenin profili

3. Mesajlar Bölümü
   - Mesaj listesi
   - Mesaj gönder formu
   - Gerçek zamanlı güncelleme (WebSocket ile olmayabilir şu anki versiyonda)
   - Mesajları sil (kendi mesajı/admin)

#### MESAJLAR (/mesajlar)

Özellikler:
- Aldığı tüm mesajları listele
- Gönderenin adı
- Mesaj içeriği
- Gönderme zamanı
- Mesajı sil

#### KİŞİSEL PROFİL (/profil)

Özellikler:
- Profil bilgileri
  * İsim
  * E-posta
  * Şehir
  * Biyografi
  * Profil fotoğrafı
- İstatistikler
  * Katıldığı etkinlik sayısı
  * Katıldığı topluluk sayısı
  * Satın aldığı bilet sayısı
  * Favori etkinlik sayısı
- Katıldığı etkinlikler listesi
- Katıldığı topluluklar listesi

Butonlar:
- Profili Düzenle
- Şifre Değiştir
- Çıkış Yap

#### PROFİL AYARLARI (/profil/ayarlar)

Özellikler:
- Profil bilgilerini güncelle
  * İsim
  * E-posta
  * Şehir
  * Biyografi
  * Profil fotoğrafı (yükleme)
- Şifre değiştir
  * Eski şifre
  * Yeni şifre
  * Yeni şifre tekrarı
- E-posta değiştir
  * Yeni e-posta
  * Doğrulama kodu
- Hesapı sil (geri dönüşümlü değil!)

Butonlar:
- Kaydet
- İptal
- Hesabı Sil

#### BİLETLERİM (/profil/biletlerim)

Özellikler:
- Katıldığı etkinliklerin listesi
- Her bilet için:
  * Etkinlik adı
  * Etkinlik tarihi
  * Etkinlik konumu
  * Bilet numarası
  * QR kodu (giriş kontrol için)
  * Bilet durumu (Geçerli, Kullanıldı, İptal Edildi)
- Bilet iptal et butonu (etkinlik gerçekleşmeden önce)
- Bilet paylaş (email, SMS, WhatsApp)

#### ADMİN PANELİ (/admin)

Özellikler (Sadece Admin'lere Açık):
- Tüm kullanıcıları görüntüle
- Tüm etkinlikleri yönet
- Tüm toplulukları yönet
- İstatistikler
  * Toplam kullanıcı sayısı
  * Toplam etkinlik sayısı
  * Toplam topluluk sayısı
  * Bu ay katılımlar
  * Gelir (ödeme yapılanlar)
- Sistem ayarları

Butonlar:
- Kategori yönetimi
- Kullanıcı rollerini değiştir
- Etkinlik sil
- Topluluk sil
- Uyarı ver (kullanıcıya)
- Yasakla

#### ETKİNLİK YÖNETİMİ (/admin/events veya /panel/events)

Özellikler (Sadece Admin):
- Etkinlik oluştur formu
  * Başlık
  * Açıklama
  * Kategori seçimi
  * Şehir
  * Adres
  * Tarih ve saat
  * Kapasite
  * Fiyat
  * Ödeme hesabı
  * Görsel yükleme
- Etkinliklerin listesi
- Her etkinlik için:
  * Düzenle
  * Sil
  * Detaylarını gör
  * Katılımcıları gör
- Ara ve filtrele

#### TOPLULUK YÖNETİMİ (/admin/communities veya /panel/communities)

Özellikler (Sadece Admin):
- Topluluk oluştur formu
  * İsim
  * Açıklama
  * Kategori seçimi
  * İcon/Emoji seçimi
- Toplulukların listesi
- Her topluluk için:
  * Düzenle
  * Sil
  * Üyeleri gör
  * Mesajları gör
- Ara ve filtrele

#### KULLANICI YÖNETİMİ (/admin/users veya /panel/users)

Özellikler (Sadece Admin):
- Tüm kullanıcıları listele
- Her kullanıcı için:
  * Profil bilgileri
  * Rol değiştir (user → admin, admin → user)
  * Hesabı sil
  * Uyarı ver
  * Yasakla
- Ara ve filtrele
- Kullanıcıların istatistikleri

---

## VERİTABANI BAĞLANTISI (Database Connection)

### MongoDB Bağlantı Yapısı (config/db.js)

Ortam Değişkenleri:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/etkinlik_db

Bağlantı URL Yapısı:
- mongodb+srv:// = MongoDB Atlas (Bulut)
- mongodb:// = Yerel MongoDB
- username:password = Giriş bilgileri
- cluster.mongodb.net = Atlas cluster adresi
- etkinlik_db = Veritabanı adı

Bağlantı Özelikleri:

1. BAĞLANTI ÖNBELLEĞE ALMA (Connection Pooling):
   - Aynı bağlantı defalarca kullanılır
   - Yeni bağlantı açılmaz
   - Performans iyileştirilir
   - Kaynak tasarrufu sağlanır

2. FALLBACK MEKANIZMASI:
   - Eğer MongoDB Atlas bağlantısı başarısız olursa
   - Yerel MongoDB (localhost:27017) denenir
   - İkisi de başarısız olursa hata verir

3. HOT-RELOAD KORUMASI:
   - Next.js geliştirme aşamasında her kaydetmede sayfayı yeniliyor
   - Bu her seferinde yeni bağlantı açmaya çalışırdı
   - Bağlantı önbelleğe alınıyor
   - Sistem çökmüyor

### Bağlantı Testi

Uyarı Durumları:
- Eğer MONGODB_URI ayarlanmamışsa uyarı verir
- Eğer Atlas bağlantısı başarısız olursa yerel deniyor
- Eğer yerel de başarısız olursa hata verir

Başarı Mesajı:
✅ Veri tabanı bağlantısı başarılı: MongoDB Atlas (veya Lokal MongoDB)

---

## GÜVENLİK YAPISI (Security Architecture)

### JWT TOKEN YAPISI

Token İçeriği (JWT Payload):
{
  id: "user_id",        // Kullanıcı database ID'si
  role: "user"|"admin", // Kullanıcı tipi
  expiresIn: "7d"       // 7 gün sonra expire olur
}

Token Süresi: 7 Gün
Token Şifreleme: JWT_SECRET (256-bit key)

Her İstekte Gönderimi:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE0NTcyMDAwLCJleHAiOjE3MTUxNzY4MDB9.abc123xyz...

Frontend'de Token Depolanması:
- localStorage'a kaydedilir
- Her fetch isteğine Authorization header eklenir
- 401 hatası alınca token silinir ve login sayfasına yönlendirilir

### ROLE-BASED ACCESS CONTROL (RBAC)

Admin Gerektiren İşlemler:
- Etkinlik oluştur (/api/events POST)
- Topluluk oluştur (/api/communities POST)
- Kategori oluştur (/api/categories POST)
- Etkinlik düzenle (başka birinin etkinliğini)
- Topluluk düzenle (başka birinin topluluğunu)
- Topluluk sil (başka birinin topluluğunu)
- Admin paneline erişim (/admin)
- Mesajı sil (başka birinin mesajını)
- Kullanıcıyı yasakla/uyar

Tüm Kullanıcılar Yapabilir:
- Etkinlikleri keşfet (/kesfet)
- Toplulukları keşfet (/topluluklar)
- Etkinliğe katıl
- Topluluğa katıl
- Profil güncelle
- Mesaj gönder
- Kendi mesajını sil
- Kendi etkinliğini düzenle (kendi etkinliğini)
- Kendi topluluğunu düzenle (kendisi admin ise)

Yetki Kontrol Kodu:
```
if (user.role !== 'admin') {
  return NextResponse.json({ error: 'Sadece yetkili hesaplar bunu yapabilir.' }, { status: 403 });
}
```

### ŞIFRE ŞIFRELEMESI (Bcrypt)

Bcrypt Parametreleri:
- Algorithm: Bcrypt (Blowfish)
- Salt Rounds: 10
- Cost Factor: 2^10 = 1024 işlem

Kayıt Sırasında:
1. Kullanıcı şifre girdi: "password123"
2. Bcrypt.genSalt(10) → Random salt oluştur
3. Bcrypt.hash("password123", salt) → Şifrelenmiş şifre oluştur
4. Veritabanına şifrelenmiş hali kaydedilir (raw şifre kaydedilmez!)
5. Şifrelenmiş şifre geri döndürülmez
6. Yalnızca "şifre oluşturuldu" mesajı döner

Giriş Sırasında:
1. Kullanıcı e-posta girdi: "user@example.com"
2. Database'den kullanıcı bulunur
3. Kullanıcı şifre girdi: "password123"
4. Bcrypt.compare("password123", database_sifresi)
5. Eğer eşleşirse token oluşturulur
6. Eğer eşleşmezse "E-posta veya şifre hatalı" hatası döner

Geri Dönüşümün İmkansızlığı:
- Bcrypt bunu tuzlamış (salted) hash fonksiyonu
- Geri dönüştürülemez (one-way)
- Şifre kırılması için brute-force gereken
- Milyonlarca deneme gerekir
- 10 salt round = Güvenlik yüksek

### EMAIL DOĞRULAMA (OTP SISTEMI)

Şifra Sıfırlama OTP Sistemi:

ADIM 1: Kullanıcı "Şifremi Unuttum" Tıklar
- Email gönderir: forgot-password endpoint'e

ADIM 2: OTP Oluşturulur
- 6 haneli random sayı: "123456"
- Şimdiki zamanı + 15 dakika = Expire zamanı
- Database'e kaydedilir
- Kullanıcının e-postasına gönderilir (simüle edilmiş, real email servisi yapılmamış)

ADIM 3: Kullanıcı OTP Girer
- OTP input formu sunar
- 15 dakika içinde girilmesi gerekli

ADIM 4: OTP Doğrulanır
- reset-password endpoint'e email, otp, new_password gönderilir
- OTP kontrol edilir (doğru mu? Süresi dolmadı mı?)
- Yeni şifre Bcrypt ile şifrelenir
- Şifre güncellenir
- OTP silinir
- "Şifreniz başarıyla güncellendi" mesajı döner

### API İstek Güvenliği

Content-Type Kontrolü:
- Tüm isteklerde Content-Type: application/json gerekli
- JSON parse hatası: 400 Bad Request

CORS Politikası:
- Same-origin requests izin veriliyor
- Cross-origin requests: Belirtilen domainler izin veriliyor
- Credentials: İçeriyor (cookies, auth headers)

Error Handling:
- Spesifik hata mesajları döndürülmüyor (Security)
- Genel mesaj: "Bir hata oluştu"
- Detaylı hatalar yalnızca geliştiriciye console'da gösterilir

---

## 📡 API İSTEK YAPISI (API Request Structure)

### Merkezi API İstemcisi (apiClient.js)

Tüm Frontend İstekleri:
- GET /api/...
- POST /api/... (body ile)
- PUT /api/... (body ile)
- DELETE /api/...

Merkezi İstemci Özellikleri:

1. TOKEN OTOMATİK EKLEME:
   - localStorage'dan token alınır
   - Authorization: Bearer TOKEN header'ına eklenir
   - Giriş yapmayan kullanıcı → token yok

2. JSON VERİ DÖNÜŞTÜRME:
   - Body otomatik JSON.stringify() yapılır
   - Response otomatik .json() parse edilir

3. OTOMATIK HATA YÖNETİMİ:
   - Network hatası: catch blokta yakalanır
   - 401 hatası: Oturum süresi dolmuş (logout yapılabilir)
   - 403 hatası: Yetkiniz yok
   - 404 hatası: Kaynağı bulunamadı
   - 500 hatası: Sunucu hatası

4. OTOMATIK LOGOUT (401'de):
   - 401 hatası alınca logout yapılabilir
   - Token silinebilir (opsiyonel)
   - Login sayfasına yönlendirilebilir (opsiyonel)

Kullanım Örnekleri:

```
apiClient.get('/api/events')
  .then(data => console.log(data))
  .catch(error => console.error(error));

apiClient.post('/api/communities', { name: "..." })
  .then(data => console.log(data))
  .catch(error => console.error(error));

apiClient.put('/api/users/123', { name: "..." })
  .then(data => console.log(data))
  .catch(error => console.error(error));

apiClient.delete('/api/events/123')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

---

## 🎨 FRONTEND BILEŞENLERI (Frontend Components)

### Paylaşılan Bileşenler (src/shared/components/)

1. Navbar.jsx
   - Üst navigation bar
   - Logo
   - Menü öğeleri
   - Kullanıcı profili dropdown
   - Giriş/Çıkış butonları
   - Arama barı

2. Button.jsx
   - Standart button bileşeni
   - Renk seçenekleri (primary, secondary, danger)
   - Boyut seçenekleri (small, medium, large)
   - Loading state
   - Disabled state
   - onClick handler

3. ProfileSidebar.jsx
   - Sol sidebar menüsü
   - Profil linkileri
   - Ayarlar linki
   - Çıkış linki
   - Admin paneli linki (admin'se)

### Stil Yapısı (Tailwind CSS + Custom CSS)

1. Tailwind CSS:
   - Utility-first CSS framework
   - Hızlı prototipleme
   - Consistent renk paleti
   - Responsive design

2. Glassmorphism (Cam Efekti):
   - Blur efektli arka plan
   - Transparency
   - Modern tasarım
   - .glass sınıfı

3. Gradient Text:
   - Renkli yazı efekti
   - Mavi → Mor → Pembe
   - .text-gradient sınıfı

4. Responsive Design:
   - Mobil (320px ve üstü)
   - Tablet (768px ve üstü)
   - Masaüstü (1024px ve üstü)
   - Tailwind's sm:, md:, lg: breakpoints

Renk Paleti:
- Arka Plan: #0f172a (Koyu mavi)
- Yazı: Beyaz (#f8fafc)
- Vurgu: Mavi (#3b82f6)
- Vurgu 2: Mor (#8b5cf6)
- Vurgu 3: Pembe (#ec4899)

---

## 📊 VERİTABANı MODELLERİ (ER Diagram)

Kullanıcı (User)
├── İsim
├── E-posta
├── Şifre
├── Rol (user/admin)
├── Şehir
├── Biyografi
├── Profil Fotoğrafı
├── Katıldığı Topluluklar (Array)
├── Sıfırlama OTP
└── Sıfırlama OTP Geçiş Saati

Etkinlik (Event)
├── Başlık
├── Açıklama
├── Kategori (ref: Category)
├── Şehir
├── Adres
├── Tarih
├── Görseli
├── Düzenleyen (ref: User)
├── Bağlı Topluluk (ref: Community)
├── Kapasite
├── Fiyat
├── Ödeme Hesabı
└── Katılımcılar (Array of Participant)

Topluluk (Community)
├── İsim
├── Açıklama
├── Kategori
├── Icon
├── Üye Sayısı
├── Sahibi (ref: User)
└── Üyeler (Array of User)

Mesaj (Message)
├── Metin
├── Topluluk (ref: Community)
├── Yazarı (ref: User)
└── Gönderme Zamanı

Katılımcı (Participant)
├── Etkinlik (ref: Event)
├── Kullanıcı (ref: User)
└── Durum (joined/cancelled/pending)

Kategori (Category)
├── İsim
├── Slug
├── İcon
└── Silinmiş mi?

Sipariş (Order)
├── Alıcı (ref: User)
├── Etkinlik (ref: Event)
├── Tutar
├── Para Birimi
├── Ödeme Durumu
├── Ödeme Yöntemi
└── İşlem ID

---

## ⚙️ REPOSITORY PATTERN (Veri Erişim Katmanı)

### Base Repository (BaseRepository.js)

Tüm Repositories'in Kalıtıldığı Sınıf:

Metodlar:

1. findMany(filters, options)
   - Dönüş: { data: Array, pagination: {...} }
   - Parametreler: filters (Mongo query), options (sort, page, limit, populate)
   - Soft delete kontrolü: silindi_mi: { $ne: true }
   - Sayfalama: skip ve limit
   - İlişkili veriler: populate

2. findById(id, populate)
   - Dönüş: Document veya null
   - ID'ye göre bul
   - Soft delete kontrolü yapılır
   - İlişkili veriler populate edilir

3. findOne(filters, populate)
   - Dönüş: Document veya null
   - İlk eşleşen dökümanı bul
   - Soft delete kontrolü yapılır
   - İlişkili veriler populate edilir

4. create(data)
   - Dönüş: Oluşturulan Document
   - Yeni döküman oluştur
   - Veritabanına kaydet
   - Timestamps otomatik eklenir

5. update(id, data)
   - Dönüş: Güncellenmiş Document
   - ID'ye göre güncelle
   - Kısmi güncelleme yapılabilir
   - Validators çalıştırılır
   - Yeni versiyon döndürülür (new: true)

6. delete(id, softDelete)
   - Dönüş: Silinen Document
   - softDelete = true (varsayılan): silindi_mi: true
   - softDelete = false: Tamamen sil
   - Soft delete veriler arşivlenir

### Özel Repository'ler

1. EventRepository
   - findWithFilters(filters, options)
   - Tarih filtresi (startDate, endDate)
   - Şehir filtresi (Regex ile)
   - Kategori filtresi
   - Populate: category, organizer, community

2. CommunityRepository
   - findMany() override değil
   - Name filtresi (Regex ile arama)
   - Populate: owner, members

3. UserRepository
   - findByEmail(email)
   - Email ile user bul
   - Şifre field'ı select edilir (+password)

4. MessageRepository
   - findByCommunityId(communityId, options)
   - Topluluk ID'sine göre mesajları getir
   - Populate: user (isim, profil, rol)

5. CategoryRepository
   - Standart findMany(), findById() vb.

---

## 📝 MANAGER KATMANI (İş Mantığı / Business Logic)

### Base Manager (BaseManager.js)

Tüm Managers'ın Kalıtıldığı Sınıf:

Metodlar:

1. getById(id, populate)
   - Repository'den veri getir
   - İş mantığı kontrolü yapabilir
   - Populate ile ilişkili veriler getir

2. create(data)
   - Veri doğruması yapılabilir
   - Repository'e iletir
   - İş mantığı kuralları kontrol edilir

3. update(id, data)
   - Veriler kontrol edilir
   - Repository'e iletir

4. delete(id)
   - Soft delete yapılır
   - Silme kuralları kontrol edilir

### Özel Managers

1. EventManager
   - createEvent(data, userId)
     * Kategori string ise ObjectId'ye çevirilir
     * Kategori yoksa otomatik oluşturulur
     * Düzenleyen otomatik eklenir
   - updateEvent(id, data, userId, userRole)
     * Yetki kontrol edilir (düzenleyen veya admin)
     * Başka biri güncellemek isterse hata döner
   - getById(id, populate) + Event spesifik

2. CommunityManager
   - createCommunity(data, userId)
     * Kurucusu otomatik eklenir
     * Kurucusu otomatik üye olur
   - addMember(communityId, userId)
     * Zaten üye mi kontrol edilir
     * Üye listesine eklenir

3. UserManager
   - validateUniqueEmail(email)
     * Email tekrarlarını kontrol eder
     * Zaten varsa hata döner
   - getProfile(id)
     * Profil bilgilerini getirir

4. MessageManager
   - getMessagesByCommunity(communityId)
     * Topluluk mesajlarını getirir
   - createMessage(data, userId)
     * Yazarı otomatik eklenir

---

## 🚀 ÇALIŞMA AKIŞI (Workflow Examples)

### ETKİNLİĞE KATILMA AKIŞI (Joining Event)

ADIM 1: Kullanıcı "/kesfet" sayfasını açar
ADIM 2: sayfa yüklenir, /api/events GET isteği gönderilir
ADIM 3: EventRepository.findMany() çağrılır
ADIM 4: MongoDB'den etkinlikler getirilir (populate: category, organizer)
ADIM 5: Sayfa da etkinlikler gösterilir
ADIM 6: Kullanıcı bir etkinliğe tıklar ve detayları görür
ADIM 7: "Katıl" butonuna tıklar
ADIM 8: POST /api/events/[id]/join isteği gönderilir
ADIM 9: verifyToken() ile kimlik doğrulanır
ADIM 10: Participant kaydı oluşturulur:
    - event: event_id
    - user: user_id
    - status: 'joined'
ADIM 11: Database'e kaydedilir
ADIM 12: Başarı mesajı döner
ADIM 13: Sayfa "Zaten katıldınız" mesajını gösteriyor
ADIM 14: Kullanıcı /profil/biletlerim'de biletini görebilir

### TOPLULUK OLUŞTURMA AKIŞI (Creating Community)

ADIM 1: Admin /admin/communities sayfasına gider
ADIM 2: "Yeni Topluluk Oluştur" butonuna tıklar
ADIM 3: Form açılır (İsim, Açıklama, Kategori, İcon)
ADIM 4: Form doldurur ve gönderir
ADIM 5: POST /api/communities isteği gönderilir
ADIM 6: verifyToken() ile kimlik doğrulanır
ADIM 7: admin kontrolü: user.role !== 'admin'
ADIM 8: Eğer admin değilse 403 Forbidden hatası döner
ADIM 9: Eğer admin ise CommunityManager.createCommunity() çağrılır
ADIM 10: Yeni Community dökümanı oluşturulur:
    - name: "Topluluk Adı"
    - description: "Açıklama"
    - category: "Kategori"
    - icon: "🎯"
    - owner: admin_user_id
    - members: [admin_user_id]  (Kurucusu otomatik üye)
    - memberCount: 1
    - aktif_mi: true
    - silindi_mi: false
ADIM 11: Database'e kaydedilir
ADIM 12: Başarı mesajı + Topluluk bilgileri döner
ADIM 13: Sayfa yenilenir ve yeni topluluk listede görüntülenir
ADIM 14: Diğer kullanıcılar /topluluklar'da görebilirler

### MESAJ GÖNDERME AKIŞI (Sending Message)

ADIM 1: Kullanıcı /topluluklar/[id]'de topluluk açar
ADIM 2: Sayfa yüklenir, tüm mesajlar getirileir
ADIM 3: GET /api/communities/[id]/messages isteği gönderilir
ADIM 4: MessageRepository.findByCommunityId() çağrılır
ADIM 5: Tüm mesajlar getirilir + populate: user (isim, profil, rol)
ADIM 6: Sayfa da mesajlar gösterilir
ADIM 7: Kullanıcı mesaj input'una yazı yazıp "Gönder" tıklar
ADIM 8: POST /api/communities/[id]/messages isteği gönderilir
ADIM 9: verifyToken() ile kimlik doğrulanır
ADIM 10: Mesaj metni kontrol edilir (boş mu?)
ADIM 11: Yeni Message dökümanı oluşturulur:
    - text: "Mesaj metni"
    - community: community_id
    - user: user_id
    - olusturulma_tarihi: now
ADIM 12: Database'e kaydedilir
ADIM 13: Yeni mesaj nesnesi döner + populate: user
ADIM 14: Sayfa da mesaj görüntülenir
ADIM 15: Input temizlenir

---

## 🎯 HENÜZ TAMMALANMAMıŞ ÖZELLIKLERI (TODO FEATURES)

1. ❌ Gerçek Ödeme Sistemi
   - Stripe entegrasyonu
   - PayPal entegrasyonu
   - İyzico (Türkiye) entegrasyonu
   - Kripto para desteği
   - Ödeme sonrası bilet oluşturma

2. ❌ Bildirimler (Notifications)
   - Etkinlik başlamaya yaklaşıyorsa hatırla (24 saat önce)
   - Topluluk yeni mesajı notification'ı
   - Etkinlik iptal edildi bildir
   - Browser push notifications
   - Email bildirimler

3. ❌ Bir-bir Mesajlaşma (Direct Messaging)
   - Kullanıcılar arasında private chat
   - Mesaj geçmişi
   - Yazıyor gösterisi
   - Son çevrimiçi zamanı

4. ❌ Favorilere Ekleme (Favorites)
   - Etkinliği favoriye ekle
   - Topluluk favoriye ekle
   - Favori listesi göster
   - Favorileri sırala

5. ❌ Profil Görseli Yüklemesi (Image Upload)
   - Profil fotoğrafı yükle
   - Etkinlik görseli yükle
   - Topluluk görseli yükle
   - Image compression
   - CDN desteği (AWS S3, Cloudinary)

6. ❌ Canlı Chat (WebSocket)
   - Real-time mesajlar
   - Yazıyor gösterisi
   - Kullanıcı şu anda çevrimiçi gösterisi
   - Yazılı olmayan mesajlar (undo)
   - Emoji support

7. ❌ E-posta Doğrulaması (Email Verification)
   - Kayıt sırasında e-posta doğrulaması
   - Verification link gönder
   - Expiring links (24 saat)
   - Yeniden gönder butonları

8. ❌ OAuth Entegrasyonu
   - Google ile giriş
   - GitHub ile giriş
   - Facebook ile giriş
   - Apple ile giriş

9. ❌ Etkinlik Bilet QR Kodu
   - QR kodu oluştur
   - QR kodunu tarar (giriş kontrolü)
   - Bilet geçerliliği kontrol et

10. ❌ Kullanıcı Ratingi/Yorumu (User Rating)
    - Etkinliği rate et (1-5 yıldız)
    - Etkinliğe yorum yap
    - Topluluk rate et
    - Yorum moderation

11. ❌ Arama Optimizasyonu (SEO)
    - Meta tags
    - Open Graph
    - Structured data
    - Sitemap
    - Robot.txt

12. ❌ Analytics Dashboard
    - Kullanıcı istatistikleri
    - Etkinlik istatistikleri
    - Topluluk istatistikleri
    - Grafik ve charts

---

## 📦 KURULUM & ÇALIŞTURMA (Installation & Running)

### Gerekli Dosyalar

.env.local Dosyasını Oluştur:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/etkinlik_db
JWT_SECRET=your_ultra_secret_key_min_32_chars_123456789
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

Açıklamalar:
- MONGODB_URI: MongoDB Atlas connection string
- JWT_SECRET: JWT token şifreleme anahtarı (en az 32 karakter)
- NEXT_PUBLIC_API_URL: Frontend'den API çağrılarında kullanılacak URL
- NODE_ENV: development, production, test

### Başlangıç Komutları

```
npm install
Açıklama: node_modules klasörüne tüm bağımlılıkları yükler

npm run dev
Açıklama: Geliştirme sunucusunu başlatır (http://localhost:3000)
Hot-reload etkin olur (dosya kaydedince otomatik yenilenir)

npm run build
Açıklama: Üretim yapısını oluşturur
Optimizasyon, minification, tree-shaking yapılır
.next klasörü oluşturulur

npm start
Açıklama: Üretim yapısını çalıştırır
npm run build'den sonra kullanılır

npm run seed
Açıklama: Veritabanını örnek verilerle doldurur
Test ve development için kullanılır
```

### Tarayıcıda Açma

Development: http://localhost:3000
Production: https://yourdomain.com

---

## ÖZET

Bu platformda aşağıdaki teknolojiler kullanılıyor:

Frontend:
- Next.js (React framework)
- Tailwind CSS (Styling)
- JavaScript/JSX

Backend:
- Next.js API Routes
- Node.js

Database:
- MongoDB
- Mongoose (ORM)

Authentication:
- JWT (JSON Web Tokens)
- Bcrypt (Şifre şifrelemesi)

Deployment:
- Vercel (Recommended)
- AWS, Heroku, vb.

Bu dokümantasyon tamamen projede var olan özellikleri kapsamaktadır. Gelecekte yeni özellikler eklenebilir.

Son güncelleme: 1 Mayıs 2026
