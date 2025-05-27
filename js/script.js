// Menunggu hingga seluruh konten HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    // Mengambil elemen-elemen yang akan dimanipulasi
    const promptForm = document.getElementById('promptForm');
    const generatedPromptTextarea = document.getElementById('generatedPrompt');
    const copyButton = document.getElementById('copyButton');
    const resetButton = document.getElementById('resetButton');
    const copyMessageElement = document.getElementById('copyMessage');

    // --- FUNGSI UNTUK MENGAMBIL NILAI DAN MENGGABUNGKAN PROMPT ---
    const generatePrompt = () => {
        // Fungsi bantu untuk mengambil nilai dari elemen berdasarkan ID
        const getValue = (id) => document.getElementById(id).value.trim();

        // Mengambil semua nilai input
        const subject = getValue('subject');
        const action = getValue('action');
        const setting = getValue('setting');
        const lighting = getValue('lighting');
        const shotType = getValue('shotType');
        const cameraAngle = getValue('cameraAngle');
        const realism = getValue('realism');
        const details = getValue('details');
        const dialogue = getValue('dialogue');
        const negative = getValue('negative');
        const duration = getValue('duration');
        const aspectRatio = getValue('aspectRatio');

        // Membangun deskripsi inti dari prompt
        let coreDescription = '';
        if (subject && action && setting) {
            coreDescription = `${subject} ${action} di ${setting}`;
        } else if (subject && action) {
            coreDescription = `${subject} ${action}`;
        } else if (subject && setting) { // Ditambahkan kondisi jika hanya subjek dan setting
            coreDescription = `${subject} di ${setting}`;
        } else if (subject) {
            coreDescription = subject;
        }

        // Menggunakan array untuk mengumpulkan bagian-bagian prompt
        // Ini memudahkan penambahan atau pengurangan bagian dan membersihkan elemen kosong
        const promptParts = [
            realism,
            shotType,
            cameraAngle ? `dari sudut pandang ${cameraAngle}` : '', // Tambahkan hanya jika ada nilai
            coreDescription,
            lighting ? `dengan pencahayaan ${lighting}` : '',
            details,
            dialogue ? `dialog: "${dialogue.replace(/"/g, '\\"')}"` : '', // Escape tanda kutip dalam dialog
            duration ? `durasi ${duration}` : ''
        ].filter(Boolean); // .filter(Boolean) akan menghapus semua string kosong atau null dari array

        // Menggabungkan bagian-bagian prompt utama dengan koma
        let finalPrompt = promptParts.join(', ');

        // Menambahkan elemen negatif jika ada
        if (negative) {
            finalPrompt += ` --no ${negative}`; // Format umum untuk prompt negatif
        }

        // Menambahkan aspect ratio jika ada
        if (aspectRatio) {
            finalPrompt += ` ${aspectRatio}`; // Format umum untuk aspect ratio
        }
        
        // Membersihkan koma ganda atau koma di akhir (jika terjadi) dan spasi berlebih
        finalPrompt = finalPrompt.replace(/, ,/g, ',').replace(/,\s*$/, '').trim();

        // Menampilkan prompt yang sudah jadi di textarea
        generatedPromptTextarea.value = finalPrompt;
    };

    // --- FUNGSI UNTUK MENYALIN TEKS KE CLIPBOARD ---
    const copyPrompt = () => {
        const promptText = generatedPromptTextarea.value;

        if (!promptText) {
            copyMessageElement.textContent = 'Prompt kosong, tidak ada yang disalin!';
            copyMessageElement.style.color = '#ff4d4d'; // Warna merah untuk pesan error
        } else {
            navigator.clipboard.writeText(promptText).then(() => {
                copyMessageElement.textContent = 'Prompt berhasil disalin!';
                copyMessageElement.style.color = '#33FF00'; // Warna hijau untuk pesan sukses
            }).catch(err => {
                console.error('Gagal menyalin teks: ', err);
                copyMessageElement.textContent = 'Gagal menyalin!';
                copyMessageElement.style.color = '#ff4d4d'; // Warna merah untuk pesan error
            });
        }

        // Menghilangkan pesan setelah 3 detik
        setTimeout(() => {
            copyMessageElement.textContent = '';
        }, 3000);
    };

    // --- FUNGSI UNTUK MERESET FORMULIR ---
    const resetForm = () => {
        promptForm.reset(); // Mereset semua input dalam form
        generatedPromptTextarea.value = ''; // Mengosongkan textarea hasil prompt
        copyMessageElement.textContent = ''; // Menghilangkan pesan status (jika ada)
    };

    // --- MENAMBAHKAN EVENT LISTENERS KE TOMBOL DAN FORM ---
    // Ketika form disubmit (tombol "Buat Prompt" diklik)
    promptForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah halaman melakukan reload standar saat form disubmit
        generatePrompt();
        copyMessageElement.textContent = ''; // Bersihkan pesan salin sebelumnya jika ada
    });

    // Ketika tombol "Salin Prompt" diklik
    copyButton.addEventListener('click', copyPrompt);

    // Ketika tombol "Reset Form" diklik
    resetButton.addEventListener('click', resetForm);
});