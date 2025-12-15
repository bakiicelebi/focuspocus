# FocusPocus - Timer Application

## 📱 Proje Hakkında

**FocusPocus**, React Native ve Expo kullanılarak geliştirilmiş modern bir zamanlayıcı (timer) uygulamasıdır. Pomodoro tekniği ve diğer zaman yönetimi metodolojilerini destekleyen bu uygulama, kullanıcıların çalışma ve mola süreçlerini etkili bir şekilde yönetmelerine yardımcı olur.

### 🌟 Temel Özellikler

- **Özelleştirilebilir Zamanlayıcılar**: Pomodoro, 52/17, Ultradian gibi hazır şablonlar ve kendi özel zamanlayıcınızı oluşturma imkanı
- **Dairesel Zamanlayıcı Arayüzü**: Görsel olarak çekici ve etkileşimli zamanlayıcı widget'ı
- **Çalışma/Mola Döngüleri**: Otomatik geçişler ve döngü tekrarlama desteği
- **İstatistik ve Raporlama**: Çalışma sürenizi ve üretkenliğinizi takip edin
- **Medya Desteği**: Arka plan videoları, müzik ve ses efektleri
- **Tema Desteği**: Light, Dark ve sistem bazlı tema seçenekleri
- **Titreşim ve Ses Bildirimleri**: Zamanlayıcı bittiğinde hatırlatıcılar
- **Arka Plan Davranışı**: Uygulama arka plandayken zamanlayıcının devam etmesi veya durması

---

## 🏗️ Teknoloji Stack'i

### Ana Teknolojiler
- **React Native** (0.81.5) - Mobil uygulama geliştirme framework'ü
- **Expo** (^54.0.23) - React Native geliştirme platformu
- **Expo Router** (~5.0.5) - Dosya tabanlı routing sistemi
- **TypeScript** (~5.8.3) - Tip güvenliği

### UI/UX Kütüphaneleri
- **Tamagui** (^1.137.1) - UI component kütüphanesi ve styling sistemi
- **React Native Reanimated** (~3.17.4) - Animasyon motoru
- **React Native SVG** (15.11.2) - SVG desteği
- **React Native Radial Slider** (^1.1.0) - Dairesel slider widget'ı

### Veri Yönetimi
- **AsyncStorage** (@react-native-async-storage/async-storage ^2.2.0) - Yerel veri depolama
- **Context API** - Global state yönetimi

### Medya ve Görselleştirme
- **Expo Video** (^3.0.15) - Video oynatıcı
- **Expo Audio** (^1.0.16) - Ses oynatma
- **React Native Gifted Charts** (^1.4.70) - Grafik ve chart bileşenleri

### Diğer Özellikler
- **Expo Haptics** (~15.0.8) - Titreşim desteği
- **Expo Font** (~13.3.1) - Özel font desteği
- **Expo Linear Gradient** (^15.0.8) - Gradient efektler

---

## 📁 Proje Yapısı

```
focuspocus/
├── app/                          # Expo Router sayfaları
│   ├── _layout.tsx              # Root layout ve provider yapısı
│   ├── +html.tsx                # Web HTML template
│   ├── +not-found.tsx           # 404 sayfası
│   ├── modal.tsx                # Modal ekranı
│   └── (tabs)/                  # Tab navigasyon grubu
│       ├── _layout.tsx          # Tab layout yapılandırması
│       ├── index.tsx            # Ana zamanlayıcı ekranı
│       ├── two.tsx              # Dashboard/İstatistik ekranı
│       └── three.tsx            # Ayarlar ekranı
│
├── components/                   # React bileşenleri
│   ├── CircularTimer.tsx        # Dairesel zamanlayıcı widget'ı
│   ├── TimerScreenContent.tsx   # Ana zamanlayıcı ekran içeriği
│   ├── TimerOptionsForm.tsx     # Zamanlayıcı seçenekleri formu
│   ├── TimerOptionCard.tsx      # Zamanlayıcı kartı bileşeni
│   ├── SettingsContent.tsx      # Ayarlar ekran içeriği
│   ├── MediaPreferences.tsx     # Medya tercihleri bileşeni
│   ├── CustomDialog.tsx         # Özel dialog bileşeni
│   ├── CustomSwitch.tsx         # Özel switch bileşeni
│   ├── FloatingLabelInputOnly.tsx # Floating label input
│   ├── VideoPlayerCustom.tsx    # Video oynatıcı
│   ├── CurrentToast.tsx         # Toast bildirimi
│   ├── Provider.tsx             # Tamagui provider wrapper
│   ├── Dashboard/               # Dashboard bileşenleri
│   │   ├── index.tsx
│   │   ├── BarChart/            # Bar chart grafiği
│   │   ├── DashBase/            # Dashboard temel bileşenleri
│   │   └── PieChart/            # Pasta grafiği
│   └── Menus/                   # Menü bileşenleri
│       ├── CustomDropDown.tsx   # Özel dropdown menü
│       ├── CustomDropDownItem.tsx
│       └── OutsidePressHelper.tsx
│
├── contexts/                     # React Context API
│   ├── TimerContext.tsx         # Zamanlayıcı state yönetimi
│   ├── UserPreferencesContext.tsx # Kullanıcı tercihleri
│   ├── ThemeContext.tsx         # Tema yönetimi
│   ├── MediaContext.tsx         # Medya (video/ses) yönetimi
│   └── AppStateContext.tsx      # Uygulama state yönetimi
│
├── hooks/                        # Custom React hooks
│   ├── useDebounce.tsx          # Debounce hook
│   ├── usePlaySound.tsx         # Ses oynatma hook
│   └── useTimerOptionLocalize.tsx # Zamanlayıcı seçeneği yerelleştirme
│
├── utils/                        # Yardımcı fonksiyonlar
│   ├── AsyncStorageUtils.tsx    # AsyncStorage işlemleri
│   ├── TimerDataUtils.tsx       # Zamanlayıcı veri hesaplamaları
│   ├── TimeFormats.tsx          # Zaman formatlama
│   ├── InterpolateColor.tsx     # Renk interpolasyonu
│   ├── Vibrations.tsx           # Titreşim pattern'leri
│   └── theme/                   # Tema yardımcıları
│       └── getNumericValue.tsx
│
├── constants/                    # Sabitler ve tipler
│   ├── ShadowProps.tsx          # Gölge stilleri
│   ├── Types/
│   │   └── TimerDataTypes.tsx   # TypeScript tipleri
│   └── Theme/                   # Tema sabitleri
│       ├── index.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── General.tsx
│       ├── Menu.tsx
│       └── Timer.tsx
│
├── assets/                       # Statik dosyalar
│   ├── fonts/                   # Font dosyaları
│   ├── images/                  # Görseller
│   ├── videos/                  # Video dosyaları
│   ├── sounds/                  # Ses efektleri
│   └── musics/                  # Müzik dosyaları
│
├── package.json                  # Proje bağımlılıkları
├── app.json                      # Expo yapılandırması
├── tsconfig.json                 # TypeScript yapılandırması
├── tamagui.config.ts            # Tamagui tema yapılandırması
├── metro.config.js              # Metro bundler yapılandırması
└── babel.config.js              # Babel yapılandırması
```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18 veya üzeri)
- Yarn (v4.5.0)
- Expo CLI
- iOS Simulator veya Android Emulator (opsiyonel)

### Kurulum Adımları

1. **Projeyi klonlayın veya indirin**
   ```bash
   cd focuspocus
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   yarn install
   ```

3. **Uygulamayı başlatın**
   ```bash
   yarn start
   # veya
   npx expo start -c
   ```

4. **Platform seçimi**
   - **iOS**: `i` tuşuna basın veya `yarn ios`
   - **Android**: `a` tuşuna basın veya `yarn android`

---

## 💡 Kullanım

### Ana Zamanlayıcı Ekranı
1. Dropdown menüden bir zamanlayıcı şablonu seçin (Pomodoro, 52/17, vb.)
2. Dairesel slider ile süreyi ayarlayın
3. Ortadaki play butonuna basarak zamanlayıcıyı başlatın
4. Çalışma süresi bittiğinde otomatik olarak mola süresine geçer
5. Repeat butonu ile döngüleri tekrarlayabilirsiniz

### Dashboard Ekranı
- Günlük, haftalık çalışma istatistiklerinizi görüntüleyin
- Chartlar ile üretkenlik takibi
- Üretkenlik trendlerinizi takip edin

### Ayarlar Ekranı
- **Timer Options**: Özel zamanlayıcı profilleri oluşturun
- **Tema**: Light/Dark/System tema seçimi
- **Medya Tercihleri**: Video, müzik ve ses efekti ayarları
- **Titreşim**: Zamanlayıcı bildirimleri için titreşim
- **Ses**: Bildirim sesleri
- **Background Behavior**: Arka planda zamanlayıcının davranışı

---

## 🎨 Özelleştirme

### Yeni Zamanlayıcı Şablonu Ekleme

Ayarlar > Timer Options bölümünden:
1. "Add New" kartına tıklayın
2. Şablon adı, çalışma süresi ve mola süresini girin
3. Kaydedin

### Tema Özelleştirme

`tamagui.config.ts` dosyasından tema renklerini düzenleyebilirsiniz.

---

## 📊 Veri Yapısı

### TimerData Interface
```typescript
interface TimerData {
  id: string;                    // Benzersiz session ID
  date: string;                  // ISO date string
  mode: "work" | "break";        // Çalışma veya mola modu
  currentTimerOption: TimerOption; // Kullanılan zamanlayıcı
  stoppedType: StoppedType;      // Durma tipi (manuel, tamamlandı, vb.)
  workSeconds: number;           // Toplam çalışma süresi (saniye)
  breakSeconds: number;          // Toplam mola süresi (saniye)
  repeatCount: number;           // Tekrar sayısı
  backgroundBehavior: "PAUSE" | "CONTINUE";
  distractedCount: number;       // Dikkat dağınıklığı sayısı
}
```

---

## 🔧 Geliştirici Notları

### Context Yapısı

Uygulama 5 ana context üzerinden yönetilir:

1. **TimerContext**: Zamanlayıcı mantığı ve state
2. **UserPreferencesContext**: Kullanıcı tercihleri
3. **ThemeContext**: Tema yönetimi
4. **MediaContext**: Video ve ses yönetimi
5. **AppStateContext**: Uygulama lifecycle yönetimi

### State Yönetimi

- Context API kullanılarak merkezi state yönetimi
- AsyncStorage ile kalıcı veri saklama
- Arka plan geçişlerinde state kurtarma mekanizması

### Animasyonlar

- React Native Reanimated kullanılarak performanslı animasyonlar
- Dairesel zamanlayıcı için smooth geçişler
- Tab bar için otomatik opacity animasyonları

---

## 📱 Platform Desteği

- ✅ **iOS** - Tam destek
- ✅ **Android** - Tam destek
- ⚠️ **Web** - Sınırlı destek (bazı native özellikler çalışmayabilir)

---

## 🐛 Bilinen Sorunlar ve Çözümler

### Video Oynatma
- Bazı cihazlarda video oynatma performans sorunları olabilir
- Çözüm: Video kalitesini düşürün veya video özelliğini kapatın

### Arka Plan Zamanlayıcı
- iOS'ta arka plan kısıtlamaları nedeniyle zamanlayıcı durabilir
- Çözüm: Ayarlar > Background Behavior > PAUSE seçeneğini kullanın

---

## 🔮 Gelecek Özellikler

- [ ] Bildirim desteği (Push Notifications)
- [ ] Bulut senkronizasyonu
- [ ] Daha detaylı istatistikler ve raporlar
- [ ] Görev (Task) entegrasyonu
- [ ] Widget desteği
- [ ] Apple Watch ve Wear OS uygulamaları
- [ ] Dil desteği (i18n)
- [ ] Sosyal özellikler (arkadaşlarla çalışma)

---

## 📝 Geliştirici Notları

Not: Bu proje bir monorepo içerisinde bulunduğu için react, react-dom ve react-native-web bağımlılıkları kaldırılmış ve metro.config.js dosyası buna göre düzenlenmiştir.

---

## 👥 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen pull request göndermeden önce:

1. Yeni bir branch oluşturun
2. Değişikliklerinizi test edin
3. Commit mesajlarını açıklayıcı yazın
4. Pull request açın

---

## 🆘 Destek

Sorun yaşıyorsanız veya önerileriniz varsa, lütfen issue açın.

---

**Made with ❤️ using React Native & Expo**
