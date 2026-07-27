export async function logVisitorInfo(db) {
    // 1. 한국 시간 생성 (KST)
    const now = new Date();
    const kstString = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(now);

    const visitorInfo = {
        timestampKST: kstString, // 한국 시간
        url: window.location.href,
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
    };

    // 2. IP 및 위치 정보 수집 (ipinfo.io 활용)
    try {
        const res = await fetch('https://ipinfo.io/json');
        const data = await res.json();
        visitorInfo.ip = data.ip;
        visitorInfo.location = `${data.country || ''} ${data.region || ''} ${data.city || ''}`;
        visitorInfo.org = data.org || ''; // ISP 정보
    } catch (e) { 
        visitorInfo.ip = 'failed'; 
        visitorInfo.location = 'unknown';
    }

    // 3. Firebase 저장
    const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
    await addDoc(collection(db, "visitors"), visitorInfo);
}
