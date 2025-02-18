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

    let comments = [
        "Phenomenal design", "Outstanding creativity", "Mind-blowing visuals", 
        "Superb execution", "Simply stunning", "Amazing concept", "Masterful work", 
        "Unreal talent", "Perfect blend of colors", "Visual masterpiece", 
        "Absolutely breathtaking", "Such brilliant detail", "Wow, so inspiring", 
        "Unique and refreshing", "Impeccable craftsmanship", "Next-level creativity", 
        "Fabulous design", "Bold and beautiful", "Innovative and fresh", "Super inspiring", 
        "Elegantly designed", "Totally captivating", "Flawless execution", "Vibrant and dynamic", 
        "A true work of art", "Creative brilliance", "Excellent attention to detail", 
        "Top-tier design", "Visually enchanting", "Perfection in every pixel", 
        "Such a clever concept", "Amazing textures", "Full of life and energy", 
        "Mesmerizing design", "Refined and elegant", "Spectacular visuals", "Sharp and clean", 
        "Such powerful creativity", "Dynamic and bold", "Art at its finest", "Superb aesthetic", 
        "Beautifully executed", "Mindfully crafted", "Astounding work", "A true inspiration", 
        "Refreshing and modern", "Unforgettable design", "Seamless execution", 
        "Simply brilliant", "Visual perfection", "greaaat!", "wonderful style, really good work", 
        "Amazing!!!", "Fantastic work, congrats.", "Inspiring!", 
        "You nail it every time! Your work is so consistent", "gorgeous!", "Perfect!!!", 
        "Wow🔥🔥", "great work!", "Looks so nice", "awesome design", 
        "Incredible work! The composition and details are truly outstanding.", 
        "your animations make a strong impression, looks creative!", "looks so great", 
        "LOVVVVE this!", "It looks dynamic and stand out", "Excellent work 👏🏻👏🏻", 
        "Amazing work!", "Amazing!", "Amazing work!", "The details and quality are outstanding", 
        "Great project!", "everything is so stylish"
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

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
            await waitFor(1000); // Adjusted scroll wait time
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
            await waitFor(2000); // Adjusted initial delay after opening project

            // Appreciate project
            let appreciateButton = document.querySelector(appreciatedSelector);
            if (appreciateButton && !appreciateButton.classList.contains('Appreciate-wrapper-REw--active')) {
                if (await clickElement(appreciatedSelector, 'Appreciate button', 1500)) {
                    projectsAppreciated++;
                    updatePopup();
                }
            } else {
                console.log("✅ Already appreciated, skipping...");
            }

            // Scroll to comment area
            await scrollToElement(commentInputSelector); // Scrolls to input area now

            // Post comment
            document.querySelector(modalSelector)?.remove();
            await waitFor(800); // Adjusted delay before typing comment
            let commentInput = document.querySelector(commentInputSelector);
            if (commentInput) {
                comments = shuffle(comments); // Shuffle comments before selecting
                let randomComment = comments[Math.floor(Math.random() * comments.length)];
                let i = 0;
                while (i < randomComment.length) {
                    commentInput.value += randomComment.charAt(i);
                    commentInput.dispatchEvent(new Event('input', { bubbles: true }));
                    await waitFor(Math.floor(Math.random() * 150) + 50); // Faster typing delay
                    i++;
                }
                await waitFor(2000); // Adjusted wait after typing
                let commentButton = Array.from(document.querySelectorAll(commentButtonSelector)).find(btn => btn.innerText.includes('Post a Comment'));
                if (commentButton) {
                    commentButton.click();
                    await waitFor(2000); // Shortened wait after posting
                    commentsPosted++;
                    updatePopup();
                } else {
                    console.log("❌ Comment button not found");
                }
            } else {
                console.log("❌ Comment input not found");
            }

            // Close project
            await clickElement(closeButtonSelector, 'Close button', 1500); // Shortened close delay
            console.log("✅ Completed project actions, moving to next...");

            // Random delay capped at 3.5 seconds
            const randomDelay = Math.floor(Math.random() * 7000) + 3000; // Random delay between 3-10 seconds
            console.log(`⏳ Waiting for ${randomDelay / 1000} seconds...`);
            await waitFor(randomDelay);
        }

        console.log(`🎉 Total projects appreciated: ${projectsAppreciated}`);
        console.log(`💬 Total comments posted: ${commentsPosted}`);
    }

    console.log("🚀 Script started...");
    await processProjects();
    console.log("✅ Script completed!");
})();
