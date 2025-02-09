(async function automateBehance() {
    let projectsAppreciated = 0;
    const maxProjects = 1000; // Limit the number of projects to process
    const projectGridSelector = '.ProjectCoverNeue-coverLink-U39'; // Selector for project covers
    const appreciatedSelector = '.Appreciate-wrapper-REw.Project-appreciateTopSidebarIcon-_E7';
    const followButtonSelector = '.FollowButtonMinimal-button-jX1.rf-button--follow';
    const closeButtonSelector = '.Btn-button-CqT.Btn-inverted-GDL.Btn-normal-If5.Btn-shouldBlur-ZHs.UniversalPopup-closeModule-RuD';
    let clickedProjects = new Set(); // Track already clicked projects

    // Create a floating popup for displaying counts
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
    popup.style.display = 'none'; // Initially hidden
    popup.innerHTML = `
        <h4>Automation Progress:</h4>
        <p id="appreciatedCount">Appreciated: 0</p>
    `;
    document.body.appendChild(popup);

    function updatePopup() {
        document.getElementById('appreciatedCount').innerText = `Appreciated: ${projectsAppreciated}`;
    }

    // Function to wait for a specific period
    async function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to click an element and wait for a delay
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

    // Function to process all projects
    async function processProjects() {
        // Select all project covers but only pick the ones that have not been clicked yet
        let projectCovers = Array.from(document.querySelectorAll(projectGridSelector))
            .filter(project => !clickedProjects.has(project))  // Only process unclicked projects
            .slice(0, maxProjects); // Limit to the max number of projects

        for (let project of projectCovers) {
            clickedProjects.add(project); // Mark the project as clicked
            project.click();  // Open the project
            console.log("✅ Opened project cover...");
            await waitFor(3000);  // Wait for the project popup to load

            // Click "Appreciate" button (like button) if not already appreciated
            let appreciateButton = document.querySelector(appreciatedSelector);
            if (appreciateButton && !appreciateButton.classList.contains('Appreciate-wrapper-REw--active')) {
                let appreciated = await clickElement(appreciatedSelector, 'Appreciate button', 2000);
                if (appreciated) projectsAppreciated++;
                updatePopup(); // Update the popup
            } else {
                console.log("✅ Already appreciated this project, skipping...");
            }

            // Click "Follow" button if not already followed
            let followButton = document.querySelector(followButtonSelector);
            let alreadyFollowed = document.querySelector('.Tooltip-wrapper-Uzv.Tooltip-responsive-XDl.FollowButtonMinimal-followBtn-ylc.Avatar-follow-Arf');
            if (followButton && !alreadyFollowed) {
                await clickElement(followButtonSelector, 'Follow button', 2000);
            } else {
                console.log("✅ Already followed, skipping...");
            }

            // Close the project popup after interacting with it
            await clickElement(closeButtonSelector, 'Close button', 2000);

            console.log("✅ Completed project actions, moving to next...");
        }

        console.log(`🎉 Total projects appreciated: ${projectsAppreciated}`);
    }

    // Show the popup and start the process
    popup.style.display = 'block'; // Show the popup
    console.log("🚀 Script started...");
    await processProjects();  // Process all projects
    console.log("✅ Script completed!");
})();
