document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feed-container');

    // 模擬貼文資料 (Mock Data)
    const posts = [
        {
            id: 1,
            author: "開拓者_001",
            avatar: "https://ui-avatars.com/api/?name=K&background=ffb300&color=fff",
            time: "2小時前",
            title: "【攻略】流螢完全培養指南！遺器、光錐選擇分析",
            content: "流螢作為最新的火屬性毀滅角色，這篇攻略將帶大家詳細分析她的技能機制以及如何搭配隊伍...",
            image: "https://picsum.photos/seed/hoyo1/600/350",
            stats: { likes: 1234, comments: 89, views: 15600 }
        },
        {
            id: 2,
            author: "旅行者_Tw",
            avatar: "https://ui-avatars.com/api/?name=T&background=0D8ABC&color=fff",
            time: "5小時前",
            title: "納塔地圖預覽？新的冒險即將開始！",
            content: "根據最新的前瞻直播，納塔的地形似乎非常獨特，充滿了火山與溫泉的元素...",
            image: "https://picsum.photos/seed/hoyo2/600/350",
            stats: { likes: 567, comments: 23, views: 8900 }
        },
        {
            id: 3,
            author: "繩匠",
            avatar: "https://ui-avatars.com/api/?name=Z&background=222&color=fff",
            time: "1天前",
            title: "絕區零公測倒數！你準備好了嗎？",
            content: "期待已久的動作遊戲終於要上線了，大家最想抽的角色是誰呢？我自己是鎖定鯊魚妹了！",
            image: null, // No image for this post
            stats: { likes: 3341, comments: 512, views: 42000 }
        },
        {
            id: 4,
            author: "愛莉希雅",
            avatar: "https://ui-avatars.com/api/?name=E&background=ff69b4&color=fff",
            time: "1天前",
            title: "致以無瑕的你",
            content: "不管過去了多久，我依然會在這裡等著大家。真我·人之律者，永遠愛著人類。",
            image: "https://picsum.photos/seed/hoyo3/600/350",
            stats: { likes: 9999, comments: 777, views: 100000 }
        }
    ];

    // Render Posts
    function renderPosts() {
        if (!posts || posts.length === 0) {
            feedContainer.innerHTML = '<p>目前沒有貼文。</p>';
            return;
        }

        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'post-card';

            // Image Section (Conditional)
            const imageHtml = post.image ?
                `<img src="${post.image}" alt="Post Image" class="post-image">` : '';

            card.innerHTML = `
                <div class="post-header">
                    <img src="${post.avatar}" alt="${post.author}" class="author-avatar">
                    <div class="author-info">
                        <h4>${post.author}</h4>
                        <span class="post-time">${post.time}</span>
                    </div>
                </div>
                <div class="post-body">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-content">${post.content}</p>
                    ${imageHtml}
                </div>
                <div class="post-footer">
                    <div class="post-stat">
                        <i class="fa-regular fa-thumbs-up"></i>
                        <span>${formatNumber(post.stats.likes)}</span>
                    </div>
                    <div class="post-stat">
                        <i class="fa-regular fa-comment"></i>
                        <span>${formatNumber(post.stats.comments)}</span>
                    </div>
                    <div class="post-stat">
                        <i class="fa-regular fa-eye"></i>
                        <span>${formatNumber(post.stats.views)}</span>
                    </div>
                </div>
            `;

            feedContainer.appendChild(card);
        });
    }

    // Helper: Format large numbers (e.g. 1000 -> 1k)
    function formatNumber(num) {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + '萬';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    }

    // Initialize
    renderPosts();
});
