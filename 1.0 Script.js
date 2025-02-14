(async function automateBehance() {
    let projectsAppreciated = 0;
    let commentsPosted = 0;
    const maxProjects = 250;
    const projectGridSelector = '.ProjectCoverNeue-coverLink-U39';
    const appreciatedSelector = '.Appreciate-wrapper-REw.Project-appreciateTopSidebarIcon-_E7';
    const followButtonSelector = '.FollowButtonMinimal-button-jX1.rf-button--follow';
    const closeButtonSelector = '.Btn-button-CqT.Btn-inverted-GDL.Btn-normal-If5.Btn-shouldBlur-ZHs.UniversalPopup-closeModule-RuD';
    const commentInputSelector = '.TextArea-input-GZ6.ProjectCommentInput-commentTextArea-Vcg.TextArea-textarea';
    const commentButtonSelector = '.Btn-labelWrapper-_Re';
    const modalSelector = '.PersonalizedContentFeedModal-modal-hqT';
    const commentContainerSelector = '.ProjectComments-projectCommentContainer-pzz';

    const comments = [
        "Awesome work! 😍",
        "I love the design! 🔥",
        "Brilliant concept! 👏",
        "Incredible attention to detail! 🎯",
        "Such creative execution! 🌟",
        "Top-notch design! 💯",
        "Very inspiring project! 🚀",
        "Stunning visuals! 🎨",
        "Beautifully crafted! 🛠️",
        "Impressive creativity! 💡",
        "Fantastic composition! 🖼️",
        "Absolutely love this! ❤️",
        "Exceptional quality! 🏆",
        "Creative genius at work! 🧠",
        "The colors are amazing! 🌈",
        "Brilliant storytelling! 📖",
        "This stands out! ✨",
        "Remarkable craftsmanship! 🛠️",
        "Such a unique perspective! 👁️",
        "The texture is perfect! 🌊"
    ];

    let clickedProjects = new Set();

    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.padding = '10px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    popup.style.color = 'white';
    popup.style.borderRadius = '5px';
    popup.style.fontSize = '14px';
    popup.style.zIndex = '10000';
    popup.style.display = 'block';
    popup.innerHTML = `
        <h4>Automation Progress:</h4>
        <p id="appreciatedCount">Appreciated: 0</p>
        <p id="commentCount">Comments: 0</p>
    `;
    document.body.appendChild(popup);

    function updatePopup() {
        document.getElementById('appreciatedCount').innerText = `Appreciated: ${projectsAppreciated}`;
        document.getElementById('commentCount').innerText = `Comments: ${commentsPosted}`;
    }

    async function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickElement(selector, description, delay = 1000) {
        let element = document.querySelector(selector);
        if (element) {
            element.click();
            console.log(`✅ Clicked: ${description}`);
            await waitFor(delay);
            return true;
        }
        return false;
    }

    async function scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await waitFor(2000);
            console.log(`✅ Scrolled to: ${selector}`);
        }
    }

    async function processProjects() {
        let projectCovers = Array.from(document.querySelectorAll(projectGridSelector))
            .filter(project => !clickedProjects.has(project))
            .slice(0, maxProjects);

        for (let project of projectCovers) {
            clickedProjects.add(project);
            project.click();
            console.log("✅ Opened project cover...");
            await waitFor(3000);

            // Appreciate project
            let appreciateButton = document.querySelector(appreciatedSelector);
            if (appreciateButton && !appreciateButton.classList.contains('Appreciate-wrapper-REw--active')) {
                if (await clickElement(appreciatedSelector, 'Appreciate button', 2000)) {
                    projectsAppreciated++;
                    updatePopup();
                }
            } else {
                console.log("✅ Already appreciated, skipping...");
            }

            // Scroll to comment area
            await scrollToElement(commentContainerSelector);

            // Post comment
            document.querySelector(modalSelector)?.remove();
            await waitFor(1000);
            let commentInput = document.querySelector(commentInputSelector);
            if (commentInput) {
                let randomComment = comments[Math.floor(Math.random() * comments.length)];
                let i = 0;
                while (i < randomComment.length) {
                    commentInput.value += randomComment.charAt(i);
                    commentInput.dispatchEvent(new Event('input', { bubbles: true }));
                    await waitFor(Math.floor(Math.random() * 200) + 100);
                    i++;
                }
                await waitFor(3000);
                let commentButton = Array.from(document.querySelectorAll(commentButtonSelector)).find(btn => btn.innerText.includes('Post a Comment'));
                if (commentButton) {
                    commentButton.click();
                    await waitFor(5000);
                    commentsPosted++;
                    updatePopup();
                } else {
                    console.log("❌ Comment button not found");
                }
            } else {
                console.log("❌ Comment input not found");
            }

            // Close project
            await clickElement(closeButtonSelector, 'Close button', 3000);
            console.log("✅ Completed project actions, moving to next...");

            // Random delay to mimic human behavior
            const randomDelay = Math.floor(Math.random() * 7000) + 3000;
            console.log(`⏳ Waiting for ${randomDelay / 1000} seconds before the next project...`);
            await waitFor(randomDelay);
        }

        console.log(`🎉 Total projects appreciated: ${projectsAppreciated}`);
        console.log(`💬 Total comments posted: ${commentsPosted}`);
    }

    console.log("🚀 Script started...");
    await processProjects();
    console.log("✅ Script completed!");
})();
