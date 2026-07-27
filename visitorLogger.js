export async function logVisitorInfo(db) {
    const visitorInfo = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
    };

    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        visitorInfo.ip = data.ip;
    } catch (e) { visitorInfo.ip = 'failed'; }

    const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
    await addDoc(collection(db, "visitors"), visitorInfo);
}
