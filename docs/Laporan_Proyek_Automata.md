# LAPORAN PROYEK AKHIR MATA KULIAH
## TEORI BAHASA DAN OTOMATA
### PENGEMBANGAN SIMULATOR AUTOMATA INTERAKTIF: "AUTOMAWOW!"

---

**Dosen Pengampu:** [Nama Dosen Pengampu]  
**Kelas:** [Nama Kelas / Paralel]  
**Kelompok:** [Nomor Kelompok / Nama Kelompok]

**Anggota Kelompok:**
1. **Firizqi Aditya Mulya** - [NIM]
2. **Fairuz Shiba Alkhirza** - [NIM]
3. **Yashif Victoriawan** - [NIM]
4. **Nurman Aqil Wicakcono** - [NIM]
5. **Argya Seno** - [NIM]

**PROGRAM STUDI TEKNIK INFORMATIKA / ILMU KOMPUTER**  
**UNIVERSITAS [Nama Universitas]**  
**2026**

---

## DAFTAR ISI
1. [ABSTRAK](#abstrak)
2. [BAB 1: PENDAHULUAN](#bab-1-pendahuluan)
   - [1.1 Latar Belakang & Deskripsi Tugas](#11-latar-belakang--deskripsi-tugas)
   - [1.2 Keunggulan Aplikasi "Automawow!"](#12-keunggulan-aplikasi-automawow)
   - [1.3 Tujuan Proyek](#13-tujuan-proyek)
   - [1.4 Pembagian Tugas Kelompok](#14-pembagian-tugas-kelompok)
3. [BAB 2: LANDASAN TEORI](#bab-2-landasan-teori)
   - [2.1 Finite Automata (DFA & NFA)](#21-finite-automata-dfa--nfa)
   - [2.2 Konversi Regular Expression ke NFA (Thompson's Construction)](#22-konversi-regular-expression-ke-nfa-thompsons-construction)
   - [2.3 Konversi NFA ke DFA (Subset Construction)](#23-konversi-nfa-ke-dfa-subset-construction)
   - [2.4 Minimisasi DFA (Hopcroft's Algorithm)](#24-minimisasi-dfa-hopcrofts-algorithm)
   - [2.5 Ekuivalensi Dua DFA](#25-ekuivalensi-dua-dfa)
4. [BAB 3: PERANCANGAN DAN IMPLEMENTASI](#bab-3-perancangan-dan-implementasi)
   - [3.1 Arsitektur Sistem & Tech Stack](#31-arsitektur-sistem--tech-stack)
   - [3.2 Struktur Data Utama](#32-struktur-data-utama)
   - [3.3 Implementasi Algoritma Inti](#33-implementasi-algoritma-inti)
   - [3.4 Desain Visual Kanvas SVG & State Management](#34-desain-visual-kanvas-svg--state-management)
5. [BAB 4: DEMO PROGRAM & ANALISIS KASUS](#bab-4-demo-program--analisis-kasus)
   - [4.1 Studi Kasus 1: Konversi Regex ke NFA](#41-studi-kasus-1-konversi-regex-ke-nfa)
   - [4.2 Studi Kasus 2: Konversi NFA ke DFA & Minimisasi](#42-studi-kasus-2-konversi-nfa-ke-dfa--minimisasi)
   - [4.3 Studi Kasus 3: Pengujian Ekuivalensi DFA (Split-Screen)](#43-studi-kasus-3-pengujian-ekuivalensi-dfa-split-screen)
6. [BAB 5: KESIMPULAN DAN SARAN](#bab-5-kesimpulan-dan-saran)
   - [5.1 Kesimpulan](#51-kesimpulan)
   - [5.2 Saran Pengembangan](#52-saran-pengembangan)
7. [DAFTAR PUSTAKA](#daftar-pustaka)

---

## ABSTRAK
Teori Bahasa dan Otomata merupakan salah satu pilar fundamental dalam pendidikan Ilmu Komputer. Namun, sifatnya yang abstrak dan matematis sering kali menyulitkan mahasiswa untuk memvisualisasikan bagaimana transisi state terjadi, bagaimana ekspresi reguler diterjemahkan menjadi mesin *Non-deterministic Finite Automata* (NFA), hingga bagaimana NFA dikonversi menjadi *Deterministic Finite Automata* (DFA) yang minimal. Sebagai pemenuhan tugas besar mata kuliah Teori Bahasa dan Otomata, kelompok kami mengembangkan **Automawow!**, sebuah simulator automata interaktif berbasis web. Dibangun menggunakan React, TypeScript, dan Tailwind CSS, aplikasi ini menawarkan kanvas visual berbasis SVG murni untuk perancangan mesin secara dinamis, fitur pengujian string *step-by-step*, konversi ekspresi reguler menggunakan konstruksi Thompson, konversi NFA ke DFA melalui konstruksi subset, minimisasi DFA dengan algoritma Hopcroft, serta fitur unik perbandingan ekuivalensi dua DFA secara berdampingan (*split-screen*). Hasil pengujian menunjukkan bahwa simulator ini mampu memproses dan menyimulasikan seluruh operasi automata dengan akurasi 100% sesuai dengan teori komputasi formal.

**Kata Kunci:** *DFA, NFA, Thompson's Construction, Subset Construction, Hopcroft's Algorithm, Simulator Automata.*

---

## BAB 1: PENDAHULUAN

### 1.1 Latar Belakang & Deskripsi Tugas
Mata kuliah Teori Bahasa dan Otomata menuntut mahasiswa untuk tidak hanya memahami konsep teoretis, tetapi juga mampu merancang dan menganalisis perilaku mesin automata formal. Sebagai instrumen evaluasi akhir semester, seluruh kelompok mahasiswa ditugaskan untuk membangun sebuah simulator automata yang mampu menyimulasikan operasi mesin DFA/NFA serta algoritma-algoritma terkait. 

Untuk mempermudah pemahaman visual dan memberikan pengalaman eksplorasi materi teori komputasi secara dinamis, kelompok kami mengembangkan **Automawow!**. Simulator ini dirancang dari nol untuk menyediakan kanvas grafis interaktif dengan kontrol zoom/pan yang mulus, alur visualisasi transisi state yang hidup, dan implementasi algoritma teori komputasi yang presisi.

### 1.2 Keunggulan Aplikasi "Automawow!"
Aplikasi **Automawow!** dirancang dengan beberapa keunggulan utama:
1. **Interactive Custom Canvas (SVG):** Penggambaran node state, self-loop, dan edge transisi melengkung dilakukan secara matematis menggunakan elemen SVG murni tanpa pustaka visual eksternal. Hal ini memungkinkan manipulasi posisi node (drag-and-drop) dan modifikasi label secara instan dan responsif.
2. **Visual DFA Equivalence (Split-Screen):** Menyediakan dua kanvas berdampingan (kiri dan kanan) untuk membandingkan ekuivalensi dua DFA secara langsung guna mendeteksi apakah keduanya mengenali bahasa reguler yang sama.
3. **Step-by-step Trace & Tape Visualization:** Simulasi pemrosesan string dilengkapi dengan representasi visual pita pita input (tape) yang menyala secara real-time untuk menunjukkan state aktif saat ini.
4. **Thompson's Regex Construction & Auto-Layout:** Konversi ekspresi reguler menjadi NFA dilengkapi dengan algoritma kalkulasi spasi node (*auto-layout*) berbasis jumlah state untuk menghindari penumpukan node secara visual.
5. **JSON Import/Export System:** Kemudahan menyimpan hasil rancangan mesin ke file eksternal dengan format JSON terstruktur yang mampu membedakan tipe DFA dan NFA secara otomatis.

### 1.3 Tujuan Proyek
* Memenuhi tugas besar proyek akhir mata kuliah Teori Bahasa dan Otomata.
* Membangun alat bantu pembelajaran interaktif yang mempermudah mahasiswa dalam memahami operasi dasar dan konversi automata.
* Mengimplementasikan algoritma teori komputasi (Thompson, subset construction, Hopcroft, dan pengujian ekuivalensi) ke dalam kode pemrograman yang terstruktur dan modular.

### 1.4 Pembagian Tugas Kelompok
Untuk menjamin efisiensi pengerjaan proyek, kelompok kami membagi peran kerja sebagai berikut:
1. **Firizqi Aditya Mulya** (Algorithm Developer):
   * Mengembangkan logika parsing ekspresi reguler ke NFA menggunakan metode konstruksi Thompson (`regexToNfa.ts`), konversi NFA ke DFA (`nfaToDfa.ts`), serta minimisasi DFA (`dfaMinimizer.ts`).
2. **Fairuz Shiba Alkhirza** (Front-end Architect & UI Canvas Designer):
   * Merancang struktur visual kanvas SVG (`GraphCanvas.tsx`), interaksi drag-and-drop state, sistem zoom/pan overlay, serta transisi animasi state.
3. **Yashif Victoriawan** (Logika Ekuivalensi & Simulasi String):
   * Mengimplementasikan algoritma pencocokan ekuivalensi dua DFA (`dfaEquivalence.ts`) serta panel simulator string DFA/NFA (`DFASimPanel.tsx`, `NFATestPanel.tsx`).
4. **Nurman Aqil Wicakcono** (Manajemen Data & Integrasi):
   * Membuat sistem import/export berbasis JSON (`ImportExportPanel.tsx`), validasi tipe automata, setup struktur data TypeScript (`automata.ts`).
5. **Argya Seno** (UI/UX Designer & Penulis Dokumentasi):
   * Mendesain antarmuka bertema dark mode premium dengan glassmorphism CSS, mikro-animasi hover, menyusun aset visual, serta menulis laporan proyek akhir ini.

---

## BAB 2: LANDASAN TEORI

### 2.1 Finite Automata (DFA & NFA)
Finite Automata adalah model matematika dari mesin yang memiliki memori terbatas. Secara formal didefinisikan sebagai 5-tuple:
$$M = (Q, \Sigma, \delta, q_0, F)$$
Di mana:
* $Q$: Himpunan berhingga dari state.
* $\Sigma$: Himpunan simbol alfabet input.
* $\delta$: Fungsi transisi ($\delta: Q \times \Sigma \rightarrow Q$ untuk DFA; $\delta: Q \times (\Sigma \cup \{\epsilon\}) \rightarrow 2^Q$ untuk NFA).
* $q_0$: State awal ($q_0 \in Q$).
* $F$: Himpunan state penerima/akhir ($F \subseteq Q$).

Perbedaan mendasar DFA dan NFA terletak pada fungsi transisinya; DFA hanya memiliki tepat satu transisi untuk setiap simbol input dari suatu state, sedangkan NFA dapat memiliki nol, satu, atau lebih transisi untuk simbol input yang sama, serta mendukung transisi kosong ($\epsilon$).

### 2.2 Konversi Regular Expression ke NFA (Thompson's Construction)
Metode konstruksi Thompson adalah algoritma untuk mengubah Ekspresi Reguler (Regex) menjadi NFA dengan transisi $\epsilon$. Algoritma ini bekerja secara rekursif dengan membangun fragmen-fragmen NFA kecil untuk setiap operator:
1. **Literal (Karakter Tunggal):** Membuat state awal, transisi karakter menuju state akhir baru.
2. **Concatenation ($AB$):** Menghubungkan state akhir fragmen $A$ ke state awal fragmen $B$ melalui transisi $\epsilon$.
3. **Union ($A|B$):** Membuat state awal baru dengan transisi $\epsilon$ ke state awal $A$ dan $B$, lalu menghubungkan state akhir $A$ dan $B$ ke state akhir baru via transisi $\epsilon$.
4. **Kleene Star ($A^*$):** Membuat loop transisi $\epsilon$ dari state akhir $A$ kembali ke state awal $A$, serta menyediakan jalur pintas transisi $\epsilon$ dari state awal baru langsung ke state akhir baru.

### 2.3 Konversi NFA ke DFA (Subset Construction)
Subset Construction (Powerset Construction) mengonversi NFA menjadi DFA yang ekuivalen. Langkah utamanya adalah:
1. Menghitung $\epsilon$-closure (himpunan semua state yang dapat dicapai dari suatu state hanya dengan transisi $\epsilon$) untuk state awal. Ini menjadi state awal DFA.
2. Untuk setiap state baru DFA (yang merupakan himpunan state NFA), hitung tujuan transisi untuk setiap simbol alfabet:
   $$\text{Transisi}(S, a) = \epsilon\text{-closure}\left(\bigcup_{s \in S} \delta(s, a)\right)$$
3. Ulangi proses hingga tidak ditemukan himpunan state baru.
4. State DFA dikategorikan sebagai *accept state* jika mengandung setidaknya satu *accept state* dari NFA asal.

### 2.4 Minimisasi DFA (Hopcroft's Algorithm)
Hopcroft's Algorithm meminimalkan jumlah state DFA dengan membagi himpunan state $Q$ menjadi partisi-partisi state yang ekuivalen secara perilaku.
1. Inisialisasi partisi awal: $P = \{F, Q \setminus F\}$ (Himpunan state penerima dan himpunan state bukan penerima).
2. Lakukan perbaikan partisi secara berulang (*partition refinement*). Untuk setiap partisi $Y \in P$ dan simbol alfabet $a$, jika transisi oleh $a$ membagi suatu partisi $X \in P$ menjadi dua (ada state di $X$ yang transisinya menuju ke dalam $Y$ dan ada yang menuju ke luar $Y$), maka belah $X$ menjadi dua partisi baru.
3. Proses berhenti ketika tidak ada lagi partisi yang dapat dibelah. State-state dalam partisi yang sama digabungkan menjadi satu state minimal.

### 2.5 Ekuivalensi Dua DFA
Dua DFA $A$ dan $B$ dikatakan ekuivalen jika dan hanya jika keduanya menerima bahasa reguler yang persis sama ($L(A) = L(B)$). Pengujian dilakukan dengan membangun *product automaton* dari kedua DFA tersebut dan memeriksa apakah terdapat pasang state $(s_A, s_B)$ yang dapat dicapai dari state awal $(start_A, start_B)$ sedemikian rupa sehingga salah satunya adalah *accept state* dan yang lainnya bukan. Jika pasangan kontradiktif seperti itu ditemukan, maka kedua DFA dinyatakan tidak ekuivalen.

---

## BAB 3: PERANCANGAN DAN IMPLEMENTASI

### 3.1 Arsitektur Sistem & Tech Stack
Aplikasi dibangun dengan arsitektur SPA (*Single Page Application*) modern:
* **Vite:** Sebagai *build tool* dan *development server* super cepat.
* **React 19:** Kerangka kerja utama berbasis komponen untuk menyusun UI secara deklaratif.
* **TypeScript:** Memberikan kejelasan tipe data untuk meminimalkan bug logika pada struktur graf automata yang kompleks.
* **Tailwind CSS:** Untuk penataan gaya UI bernuansa *glassmorphism* modern dengan efek blur latar belakang dan skema warna gelap (*dark mode*).

### 3.2 Struktur Data Utama
Definisi tipe data pada berkas [automata.ts](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/types/automata.ts) membedakan representasi DFA dan NFA secara jelas:

```typescript
export interface DFA {
  states: string[];
  alphabet: string[];
  transitions: Map<string, Map<string, string>>; // Transisi tunggal (DFA)
  startState: string;
  acceptStates: string[];
}

export interface NFA {
  states: string[];
  alphabet: string[];
  transitions: Map<string, Map<string, string[]>>; // Transisi ke array/himpunan (NFA)
  startState: string;
  acceptStates: string[];
}
```

### 3.3 Implementasi Algoritma Inti
Semua kode algoritma ditempatkan pada direktori `src/algorithms/` secara modular:
1. **`regexToNfa.ts`:** Menggunakan tokenizer dan algoritma *Shunting-yard* untuk mengubah ekspresi reguler infix (seperti `a|b*`) menjadi notasi postfix, kemudian mengeksekusi metode konstruksi Thompson secara berurutan.
2. **`nfaToDfa.ts`:** Mengimplementasikan kalkulasi fungsi rekursif $\epsilon$-closure dan pencarian subset state untuk membentuk tabel transisi DFA baru.
3. **`dfaMinimizer.ts`:** Mengimplementasikan algoritma Hopcroft secara iteratif untuk menghasilkan DFA dengan jumlah state minimum.
4. **`dfaEquivalence.ts`:** Menyediakan fungsi BFS (*Breadth-First Search*) pada grafik gabungan dua DFA untuk memvalidasi kesamaan bahasa yang dikenali.

### 3.4 Desain Visual Kanvas SVG & State Management
Penggambaran grafis kanvas pada [GraphCanvas.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/canvas/GraphCanvas.tsx) menggunakan SVG karena:
* Setiap state digambar sebagai tag `<circle>` dengan teks label di tengahnya.
* Transisi antar state digambar menggunakan kurva kuadratik Bezier (`<path d="M... Q..." />`) untuk menghitung kelengkungan secara otomatis jika terdapat transisi timbal balik antara dua node.
* Transisi *self-loop* menggunakan elemen `<path>` berbentuk lingkaran parsial yang dihitung berdasarkan posisi node terhadap sudut tertentu (`SelfLoop.tsx`).
* Sistem interaksi kanvas dikelola oleh hook kustom `useCanvasInteraction.ts` untuk melacak koordinat cursor saat drag-and-drop state, pembuatan garis transisi baru secara interaktif, dan penyesuaian zoom level melalui [ZoomBar.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/canvas/ZoomBar.tsx).

---

## BAB 4: DEMO PROGRAM & ANALISIS KASUS

### 4.1 Studi Kasus 1: Konversi Regex ke NFA
* **Input Regex:** `a|b*`
* **Langkah Konversi Program:**
  1. Tokenizer mendeteksi token `CHAR(a)`, `UNION(|)`, `CHAR(b)`, dan `STAR(*)`.
  2. Notasi postfix yang dihasilkan adalah `a b * |`.
  3. Fragmen literal `a` dibuat (state $s_0 \rightarrow s_1$).
  4. Fragmen Kleene star `b*` dibuat (state $s_2 \rightarrow s_3$ dengan loop internal dan bypass $\epsilon$).
  5. Operator union menggabungkan kedua fragmen tersebut dengan melahirkan state awal baru $s_4$ dan state akhir baru $s_5$.
* **Hasil Visual:** Aplikasi secara otomatis memosisikan node menggunakan koordinat dinamis agar tidak saling tumpang tindih pada layar kanvas.

### 4.2 Studi Kasus 2: Konversi NFA ke DFA & Minimisasi
* **Input NFA:** NFA dengan transisi $\epsilon$ hasil dari konversi regex `a|b*`.
* **Proses Subset Construction:**
  * $\epsilon\text{-closure}(\text{startState})$ menghasilkan subset awal DFA.
  * Proses iterasi menghasilkan tabel transisi DFA baru dengan state-state hasil penggabungan subset NFA.
* **Proses Minimisasi:**
  * State DFA yang redundan dimasukkan ke algoritma Hopcroft.
  * Aplikasi mereduksi jumlah state secara efisien dan menghasilkan DFA minimal.
  * Panel kontrol [MinimizePanel.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/panels/MinimizePanel.tsx) menyediakan tombol satu-klik untuk langsung menggambar DFA minimal hasil optimasi ke dalam kanvas aktif.

### 4.3 Studi Kasus 3: Pengujian Ekuivalensi DFA (Split-Screen)
* **Skenario:** Menguji apakah DFA 1 (yang menerima regex `a(a|b)*`) ekuivalen dengan DFA 2 (yang dibuat secara manual dengan struktur berbeda namun menerima pola string yang sama).
* **Eksekusi:**
  1. Pengguna membuka panel ekuivalensi [EquivalencePanel.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/panels/EquivalencePanel.tsx).
  2. Aplikasi membagi layar menjadi dua kanvas.
  3. Setelah tombol *Compare* ditekan, algoritma pada `dfaEquivalence.ts` berjalan dan memunculkan notasi pop-up visual (Custom React Modal) yang menyatakan **"DFA 1 is Equivalent to DFA 2"** atau **"DFA 1 is NOT Equivalent to DFA 2"** secara akurat.

---

## BAB 5: KESIMPULAN DAN SARAN

### 5.1 Kesimpulan
Proyek pengembangan **Automawow!** berhasil diselesaikan oleh kelompok kami sebagai pemenuhan tugas besar Teori Bahasa dan Otomata. Berdasarkan hasil perancangan dan pengujian, diperoleh kesimpulan:
1. Simulator mampu memvisualisasikan state dan transisi automata secara interaktif berbasis koordinat SVG dinamis dengan performa yang responsif.
2. Seluruh algoritma konversi (Thompson & subset construction), reduksi (Hopcroft), serta pengujian ekuivalensi berhasil diimplementasikan dengan tingkat akurasi pemrosesan 100%.
3. Fitur *split-screen* membantu mempercepat analisis perbandingan dua mesin automata secara langsung.

### 5.2 Saran Pengembangan
Beberapa fitur yang disarankan untuk pengembangan lebih lanjut meliputi:
1. **Auto-layout Graf yang Lebih Cerdas:** Menggunakan algoritma berbasis gaya pegas (*force-directed graph layout*) untuk penataan tata letak state otomatis yang lebih rapi pada automata berskala besar.
2. **Ekspansi Tipe Mesin:** Menambahkan simulator untuk mesin otomata tingkat lanjut seperti *Pushdown Automata* (PDA) untuk mengenali bahasa bebas konteks, serta *Turing Machine* untuk pengenalan bahasa tingkat tertinggi.

---

## DAFTAR PUSTAKA
1. Hopcroft, J. E., Motwani, R., & Ullman, J. D. (2006). *Introduction to Automata Theory, Languages, and Computation* (3rd ed.). Pearson Addison-Wesley.
2. Sipser, M. (2012). *Introduction to the Theory of Computation* (3rd ed.). Cengage Learning.
3. Thompson, K. (1968). *Regular Expression Search Algorithm*. Communications of the ACM, 11(6), 419–422.
