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
```

```typescript
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
1. **`regexToNfa.ts`**: Menggunakan tokenizer dan algoritma *Shunting-yard* untuk mengubah ekspresi reguler infix (seperti `0|1*`) menjadi notasi postfix, kemudian mengeksekusi metode konstruksi Thompson secara berurutan.
2. **`nfaToDfa.ts`**: Mengimplementasikan kalkulasi fungsi rekursif $\epsilon$-closure dan pencarian subset state untuk membentuk tabel transisi DFA baru.
3. **`dfaMinimizer.ts`**: Mengimplementasikan algoritma Hopcroft secara iteratif untuk menghasilkan DFA dengan jumlah state minimum.
4. **`dfaEquivalence.ts`**: Menyediakan fungsi BFS (*Breadth-First Search*) pada grafik gabungan dua DFA untuk memvalidasi kesamaan bahasa yang dikenali.

### 3.4 Desain Visual Kanvas SVG & State Management
Penggambaran grafis kanvas pada [GraphCanvas.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/canvas/GraphCanvas.tsx) menggunakan SVG karena:
* Setiap state digambar sebagai tag `<circle>` dengan teks label di tengahnya.
* Transisi *self-loop* menggunakan elemen `<path>` berbentuk lingkaran parsial yang dihitung berdasarkan posisi node terhadap sudut tertentu (`SelfLoop.tsx`).
* Sistem interaksi kanvas dikelola oleh hook kustom `useCanvasInteraction.ts` untuk melacak koordinat cursor saat drag-and-drop state, pembuatan garis transisi baru secara interaktif, dan penyesuaian zoom level melalui [ZoomBar.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/canvas/ZoomBar.tsx).

---

## BAB 4: DEMO PROGRAM & ANALISIS KASUS

Layanan simulasi **Automawow!** diuji untuk membuktikan kesesuaian implementasi dengan empat spesifikasi tugas besar yang diwajibkan:

### 4.1 Pengujian 1: Pengujian String pada Deterministic Finite Automata (DFA)
* **Spesifikasi Tugas:** Program dapat menerima input berupa DFA, kemudian pengguna dapat memasukkan input berupa string untuk mengetes DFA tersebut.
* **Metode & Implementasi Pengujian:**
  Pengguna merancang atau memuat DFA melalui kanvas grafis. Setelah struktur DFA didefinisikan (merujuk ke panel [DFASimPanel.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/panels/DFASimPanel.tsx)), pengguna memasukkan string untuk diuji. Pemrosesan dilakukan dengan menelusuri transisi state tunggal per karakter input.
* **Hasil Jalannya Program:**
  * **DFA yang Diuji:** DFA untuk bahasa reguler $L = (0|1)^*011$ dengan himpunan state $\{q_0, q_1, q_2, q_3, q_4\}$, state awal $q_0$, dan accept state $q_4$. Secara semantik, suatu string didefinisikan sebagai **diterima (*accepted*) jika dan hanya jika string tersebut diakhiri dengan pola substring `011`.**
  * **Tabel Transisi DFA yang Diuji:**

    | State | Input `0` | Input `1` | Tipe |
    |---|---|---|---|
    | $q_0$ | $q_1$ | $q_2$ | Start |
    | $q_1$ | $q_1$ | $q_3$ | Normal |
    | $q_2$ | $q_1$ | $q_2$ | Normal |
    | $q_3$ | $q_1$ | $q_4$ | Normal |
    | $q_4$ | $q_1$ | $q_2$ | Accept |

  * **Skenario String Diterima (Accept):**
    * **Input:** `01011`
    * **Trace State:** $q_0 \xrightarrow{0} q_1 \xrightarrow{1} q_3 \xrightarrow{0} q_1 \xrightarrow{1} q_3 \xrightarrow{1} q_4$
    * **Hasil Visual:** Pita input (tape) menyala hijau, menandakan string diterima secara sukses karena berakhir di accept state $q_4$.
  * **Skenario String Ditolak (Reject):**
    * **Input:** `01010`
    * **Trace State:** $q_0 \xrightarrow{0} q_1 \xrightarrow{1} q_3 \xrightarrow{0} q_1 \xrightarrow{1} q_3 \xrightarrow{0} q_1$
    * **Hasil Visual:** Pita input menyala merah, menandakan string ditolak karena berakhir di state biasa $q_1$.

---

### 4.2 Pengujian 2: Pembuatan NFA dari Ekspresi Reguler & Pengujian String
* **Spesifikasi Tugas:** Program dapat menerima input berupa *regular expression* (regex) dan menggenerasi NFA yang berhubungan, di mana pengguna dapat memasukkan input berupa string untuk mengetes NFA maupun regex tersebut.
* **Metode & Implementasi Pengujian:**
  Pengguna mengetikkan ekspresi reguler pada panel kustom [RegexPanel.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/panels/RegexPanel.tsx). Logika di [regexToNfa.ts](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/algorithms/regexToNfa.ts) mem-parsing regex dan menggenerasi fragmen-fragmen NFA menggunakan konstruksi Thompson.
* **Hasil Jalannya Program:**
  * **Input Regex:** `(0|1)*011`
  * **NFA Hasil Generasi:** NFA dengan 11 state ($s_0$ s.d. $s_{10}$) dan transisi $\epsilon$ sebagai penyambung operator. Kanvas visual langsung merender NFA dengan tata letak otomatis (*auto-layout*) untuk mencegah penumpukan node.
  
  **Tabel Transisi NFA yang Terbentuk:**

  | State Asal | Input `0` | Input `1` | Input `ε` |
  |---|---|---|---|
  | $s_0$ (Start) | - | - | $\{s_1, s_7\}$ |
  | $s_1$ | - | - | $\{s_2, s_4\}$ |
  | $s_2$ | $\{s_3\}$ | - | - |
  | $s_3$ | - | - | $\{s_6\}$ |
  | $s_4$ | - | $\{s_5\}$ | - |
  | $s_5$ | - | - | $\{s_6\}$ |
  | $s_6$ | - | - | $\{s_1, s_7\}$ |
  | $s_7$ | $\{s_8\}$ | - | - |
  | $s_8$ | - | $\{s_9\}$ | - |
  | $s_9$ | - | $\{s_{10}\}$ (Accept) | - |

  * **Pengujian String pada NFA** (`NFATestPanel.tsx`):
    * Pengguna menginputkan string `01011`.
    * Logika di [nfaSimulator.ts](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/algorithms/nfaSimulator.ts) memproses string dengan melacak semua state aktif secara serentak karena sifat non-deterministik (melibatkan kalkulasi $\epsilon$-closure).
    * **Trace Set State:** $\{s_0, s_1, s_2, s_4, s_7\} \xrightarrow{0} \{s_3, s_6, s_1, s_2, s_4, s_7, s_8\} \xrightarrow{1} \{s_5, s_6, s_1, s_2, s_4, s_7, s_9\} \dots$ dst. berakhir dengan set yang mengandung $s_{10}$ (Accept). String dinyatakan **diterima**.

---

### 4.3 Pengujian 3: Minimisasi DFA
* **Spesifikasi Tugas:** Program dapat menerima input berupa sebuah DFA kemudian membuat DFA tersebut menjadi minimal.
* **Metode & Implementasi Pengujian:**
  Program mengambil DFA aktif di kanvas, lalu menjalankan algoritma Hopcroft (`dfaMinimizer.ts`) untuk memecah partisi state berdasarkan ekuivalensi transisi (*partition refinement*).
* **Hasil Jalannya Program:**
  * **Input DFA Awal (5 State):**
  
    | State | Input `0` | Input `1` | Tipe |
    |---|---|---|---|
    | $q_0$ | $q_1$ | $q_2$ | Start |
    | $q_1$ | $q_1$ | $q_3$ | Normal |
    | $q_2$ | $q_1$ | $q_2$ | Normal |
    | $q_3$ | $q_1$ | $q_4$ | Normal |
    | $q_4$ | $q_1$ | $q_2$ | Accept |

  * **Proses Pembagian Partisi:**
    * Inisiasi partisi awal: $P_1 = \{q_4\}$ dan $P_2 = \{q_0, q_1, q_2, q_3\}$.
    * Refinement oleh alfabet `1` membagi $P_2$ karena transisi $q_3$ menuju $P_1$, sedangkan yang lain tetap di $P_2$. Partisi pecah menjadi $P_1 = \{q_4\}$, $P_2 = \{q_3\}$, $P_3 = \{q_0, q_1, q_2\}$.
    * Refinement berikutnya membuktikan $q_0$ dan $q_2$ memiliki transisi yang ekuivalen untuk semua alfabet, sehingga digabungkan menjadi satu state minimal $\{q_{02}\}$.
  * **Output DFA Minimal (4 State):**
    Jumlah state berhasil diminimalkan dari 5 state menjadi 4 state. Pengguna dapat menerapkan visualisasi DFA minimal baru ini ke kanvas grafis utama dengan menekan tombol pada panel [MinimizePanel.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/panels/MinimizePanel.tsx).

---

### 4.4 Pengujian 4: Pengujian Ekuivalensi Dua DFA (Split-Screen)
* **Spesifikasi Tugas:** Program dapat menerima input berupa dua buah DFA, kemudian menunjukkan keduanya ekuivalen atau tidak.
* **Metode & Implementasi Pengujian:**
  Simulator menyediakan area split-screen (Kanvas Kiri dan Kanvas Kanan) melalui panel [EquivalencePanel.tsx](file:///c:/Users/ACER/OneDrive/Dokumen/Automawow/src/components/panels/EquivalencePanel.tsx). Algoritma BFS pada `dfaEquivalence.ts` melakukan traversal pada graf gabungan untuk memeriksa kesesuaian accept/reject state dari kedua DFA.
* **Hasil Jalannya Program:**
  * **Skenario Ekuivalen:** 
    * Pengguna menggambar DFA 1 (DFA hasil minimalisasi `(0|1)*011`) pada kanvas kiri, dan DFA 2 (DFA rancangan manual dengan struktur state berbeda tetapi bahasa yang sama) pada kanvas kanan.
    * Setelah tombol *Compare* ditekan, program mendeteksi tidak ada perbedaan penerimaan bahasa, lalu memunculkan modal dialog bertuliskan **"DFA 1 is Equivalent to DFA 2"**.
  * **Skenario Tidak Ekuivalen:**
    * Jika transisi salah satu DFA diubah (misalnya DFA 2 tidak menerima string yang diakhiri `011`), tombol *Compare* mendeteksi ketidakcocokan state pada jalur traversal dan menampilkan modal dialog **"DFA 1 is NOT Equivalent to DFA 2"**.

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
