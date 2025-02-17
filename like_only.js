(async function automateBehance() {
    let projectsAppreciated = 0;
    const maxProjects = 500;
    const projectGridSelector = '.ProjectCoverNeue-coverLink-U39';
    const appreciatedSelector = '.Appreciate-wrapper-REw.Project-appreciateTopSidebarIcon-_E7';
    const closeButtonSelector = '.Btn-button-CqT.Btn-inverted-GDL.Btn-normal-If5.Btn-shouldBlur-ZHs.UniversalPopup-closeModule-RuD';

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
    `;
    document.body.appendChild(popup);

    function updatePopup() {
        document.getElementById('appreciatedCount').innerText = `Appreciated: ${projectsAppreciated}`;
    }

    async function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickElement(selector, description, delay = 1000) {
        let element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await waitFor(1000);
            element.click();
            console.log(`✅ Clicked: ${description}`);
            await waitFor(delay);
            return true;
        }
        return false;
    }

    async function humanLikeScroll() {
        for (let i = 0; i < 5; i++) {
            window.scrollBy(0, window.innerHeight / 2);
            await waitFor(1500);
            window.scrollBy(0, -window.innerHeight / 3);
            await waitFor(1500);
        }
    }

    async function processProjects() {
        await humanLikeScroll();

        let projectCovers = Array.from(document.querySelectorAll(projectGridSelector))
            .filter(project => !clickedProjects.has(project))
            .slice(0, maxProjects);

        for (let project of projectCovers) {
            clickedProjects.add(project);
            project.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await waitFor(1000);
            project.click();
            console.log("✅ Opened project cover...");
            await waitFor(2000);

            let appreciateButton = document.querySelector(appreciatedSelector);
            if (appreciateButton && !appreciateButton.classList.contains('Appreciate-wrapper-REw--active')) {
                if (await clickElement(appreciatedSelector, 'Appreciate button', 1500)) {
                    projectsAppreciated++;
                    updatePopup();
                }
            } else {
                console.log("✅ Already appreciated, skipping...");
            }

            await clickElement(closeButtonSelector, 'Close button', 1500);
            console.log("✅ Completed project actions, moving to next...");
        }

        console.log(`🎉 Total projects appreciated: ${projectsAppreciated}`);
    }

    console.log("🚀 Script started...");
    await processProjects();
    console.log("✅ Script completed!");
})();
