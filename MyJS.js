
document.addEventListener("DOMContentLoaded", () => {
    const galleryElements = document.querySelectorAll("#gallery a img");
    const minDelay = 10000; // 最小切換時間 (毫秒)
    const maxDelay = 15000; // 最大切換時間 (毫秒)



    // 用於記錄每個 imgElement 當前顯示的圖片路徑
    const currentImages = new Map();

    // 初始化圖片
    function initializeImages() {
        const shuffledImages = shuffleArray([...imagePaths]);
        galleryElements.forEach((imgElement, index) => {
            const imagePath = shuffledImages[index];
            setImage(imgElement, imagePath);
            currentImages.set(imgElement, imagePath);
        });
    }

    // 隨機打亂圖片數組
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 設置圖片路徑
    function setImage(imgElement, imagePath) {
        imgElement.src = imagePath;
        imgElement.parentElement.href = imagePath;
    }

    // 獲取不與當前顯示圖片重複的圖片
    function getUniqueImage(imgElement) {
        const usedImages = Array.from(currentImages.values()); // 當前所有顯示的圖片
        const availableImages = imagePaths.filter(path => !usedImages.includes(path)); // 剩餘可用圖片

        // 如果沒有剩餘圖片，重置可用圖片列表
        if (availableImages.length === 0) {
            const otherImages = imagePaths.filter(path => path !== currentImages.get(imgElement));
            return otherImages[Math.floor(Math.random() * otherImages.length)];
        }

        return availableImages[Math.floor(Math.random() * availableImages.length)];
    }

    // 動態切換圖片，帶淡入淡出效果
    function startDynamicUpdates() {
        galleryElements.forEach((imgElement) => {
            function replaceImage() {
                const delay = Math.random() * (maxDelay - minDelay) + minDelay; // 隨機延遲
                setTimeout(() => {
                    // 獲取新的圖片路徑
                    const newImage = getUniqueImage(imgElement);

                    // 淡出動畫
                    imgElement.classList.add("fade-out");

                    setTimeout(() => {
                        // 更新圖片路徑並淡入
                        setImage(imgElement, newImage);
                        currentImages.set(imgElement, newImage);
                        imgElement.classList.remove("fade-out");
                    }, 500); // 等待淡出動畫完成

                    replaceImage(); // 遞歸執行
                }, delay);
            }
            replaceImage();
        });
    }

    // 初始化並啟動動態更新
    initializeImages();
    startDynamicUpdates();
});

// 選取所有的 checkbox 和相應的 label
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const labels = document.querySelectorAll('.category-checkbox .fa-circle-check');

// 為每個 checkbox 綁定事件監聽器
checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => {
        const label = labels[index];
        if (checkbox.checked) {
            // 選中時加上刪除線
            label.classList.add('checked');
        } else {
            // 未選中時移除刪除線
            label.classList.remove('checked');
        }
    });
});



// 獲取模板和容器
const container = document.querySelector(".col-2-3.project-grid");
const template = document.getElementById("project-template");

// // 遍歷 JSON 數據並生成內容
// projectsJson.forEach(project => {
//     // 從模板克隆內容
//     const projectElement = template.content.cloneNode(true);

//     // 修改模板內部的內容
//     const link = projectElement.querySelector("a");
//     const img = projectElement.querySelector("img");
//     const span = projectElement.querySelector("span");

//     link.href = `Pages/Projects/${project.name}/page.html`;
//     img.src = `Pages/Projects/${project.name}/asset/slide/0.jpg`;
//     img.alt = project.name;
//     span.textContent = project.name;

//     // 將生成的內容添加到容器
//     container.appendChild(projectElement);
// });
// 更新項目顯示
function updateProjects() {
    // 獲取所有被選中的標籤
    const selectedTags = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.replace("checkbox-", ""));

    selectedTags.forEach(element => {

        console.log(element);
    });
    // 清空容器
    container.innerHTML = "";

    // 遍歷 JSON 數據，篩選匹配項目
    projectsJson
        .filter(project => {
            // 如果沒有選中標籤，顯示所有項目
            if (selectedTags.length === 0) return true;

            // 檢查項目的 tags 是否包含任意被選中的標籤
            return project.tags.some(tag => selectedTags.includes(tag));
        })
        .forEach(project => {
            // 從模板克隆內容
            const projectElement = template.content.cloneNode(true);

            // 修改模板內部的內容
            const link = projectElement.querySelector("a");
            const img = projectElement.querySelector("img");
            const span = projectElement.querySelector("span");

            link.href = `/Pages/Projects/${project.name}/Page.html`;
            img.src = `/Pages/Projects/${project.name}/asset/slide/0.jpg`;
            img.alt = project.name;
            span.textContent = project.name;

            // 將生成的內容添加到容器
            container.appendChild(projectElement);
        });
}

// 為所有 checkbox 添加事件監聽器
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", updateProjects);
});
// 初始化顯示
updateProjects();