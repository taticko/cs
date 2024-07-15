let editMode = false;

document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();

    // Fetch active tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTabUrl = document.createElement('div');
            currentTabUrl.id = 'currentTabUrl';
            currentTabUrl.style.display = 'none';
            currentTabUrl.textContent = tabs[0].url;
            document.body.appendChild(currentTabUrl);
        }
    });
});

function addEventListeners() {
    const startDemoBtn = document.getElementById('startDemo');
    if (startDemoBtn) {
        startDemoBtn.addEventListener('click', () => {
            const demoTypes = Array.from(document.querySelectorAll('.demoType:checked')).map(el => el.value);
            const verticalTypes = Array.from(document.querySelectorAll('.verticalType:checked')).map(el => el.value);
            const featureTypes = Array.from(document.querySelectorAll('.featureType:checked')).map(el => el.value);

            const links = getLinks();

            const selectedLinks = links.filter(link =>
                (demoTypes.length === 0 || demoTypes.includes(link.demo)) &&
                (verticalTypes.length === 0 || verticalTypes.includes(link.vertical)) &&
                (featureTypes.length === 0 || featureTypes.includes(link.feature))
            );

            if (selectedLinks.length > 0) {
                selectedLinks.forEach(link => {
                    chrome.tabs.create({ url: link.url });
                });
            } else {
                alert('No links available for the selected demo type, vertical, and feature.');
            }
        });
    }

    document.getElementById('allDemoType').addEventListener('change', (event) => {
        const checked = event.target.checked;
        document.querySelectorAll('.demoType').forEach(el => el.checked = checked);
    });

    document.getElementById('allVerticalType').addEventListener('change', (event) => {
        const checked = event.target.checked;
        document.querySelectorAll('.verticalType').forEach(el => el.checked = checked);
    });

    document.getElementById('allFeatureType').addEventListener('change', (event) => {
        const checked = event.target.checked;
        document.querySelectorAll('.featureType').forEach(el => el.checked = checked);
    });

    document.getElementById('clearDemoType').addEventListener('click', () => {
        document.getElementById('allDemoType').checked = false;
        document.querySelectorAll('.demoType').forEach(el => el.checked = false);
    });

    document.getElementById('clearVerticalType').addEventListener('click', () => {
        document.getElementById('allVerticalType').checked = false;
        document.querySelectorAll('.verticalType').forEach(el => el.checked = false);
    });

    document.getElementById('clearFeatureType').addEventListener('click', () => {
        document.getElementById('allFeatureType').checked = false;
        document.querySelectorAll('.featureType').forEach(el => el.checked = false);
    });

    document.getElementById('editModeButton').addEventListener('click', () => {
        toggleEditMode();
    });
}

function toggleEditMode() {
    editMode = !editMode;
    const editButton = document.getElementById('editModeButton');
    editButton.textContent = editMode ? 'Done' : 'Edit';
    document.querySelectorAll('.selection-group label').forEach(label => {
        if (editMode) {
            const saveButton = document.createElement('button');
            saveButton.className = 'save-button';
            saveButton.textContent = 'Save';
            saveButton.addEventListener('click', () => saveLink(label));
            label.appendChild(saveButton);
        } else {
            const saveButton = label.querySelector('.save-button');
            if (saveButton) {
                saveButton.remove();
            }
        }
    });
}

function saveLink(label) {
    const currentTabUrl = document.getElementById('currentTabUrl').textContent;
    if (confirm('This will update the link. This change is irreversible. Do you want to proceed?')) {
        const demoType = label.querySelector('input').value;
        const verticalType = label.querySelector('input').value;
        const featureType = label.querySelector('input').value;
        
        let links = getLinks();
        const linkToUpdate = links.find(link => link.demo === demoType && link.vertical === verticalType && link.feature === featureType);
        
        if (linkToUpdate) {
            linkToUpdate.url = currentTabUrl;
            alert('Link updated successfully.');
        } else {
            alert('No matching link found to update.');
        }
    }
}

function getLinks() {
    return [
        { url: "https://cstore.pre-sales.fr/", demo: "DXA", vertical: "Retail", feature: "cstore_demo_site" },
        { url: "https://app.contentsquare.com/#/site-overview?project=5536&hash=d8f146fc030f1d86f6f53206da79b861", demo: "DXA", vertical: "Retail", feature: "main_dashboard" },
        { url: "https://app.contentsquare.com/#/analyze/zoning-v2/9142272/editor?project=5536&hash=3c0369ebb234f66505ba2b0bbdf473c2", demo: "DXA", vertical: "Retail", feature: "single_zoning" },
        { url: "https://app.contentsquare.com/#/analyze/zoning-v2/9142272/editor?project=5536&hash=42ced9e20ada04a936181f37fff09e70", demo: "DXA", vertical: "Retail", feature: "compare_zoning" },
        { url: "https://app.contentsquare.com/#/analyze/navigation-path?project=5536&hash=605b3e0d1b3aae19da3f4781c16aead2", demo: "DXA", vertical: "Retail", feature: "single_journey" },
        { url: "https://app.contentsquare.com/#/analyze/navigation-path?project=5536&hash=87cbf1944c3dec792e76345509058c94", demo: "DXA", vertical: "Retail", feature: "compare_journey_ab_test" },
        { url: "https://app.contentsquare.com/#/analyze/zoning-v2/7812640/editor?project=22624&hash=ee6e449f4841d1e4a60224264e35fe53", demo: "DXA", vertical: "Banking", feature: "single_zoning" },
        { url: "https://app.contentsquare.com/#/analyze/zoning-v2/7812640/editor?project=22624&hash=f4e4fccdb300b6a1bbd51d614be789bb", demo: "DXA", vertical: "Banking", feature: "compare_zoning" },
        { url: "https://app.contentsquare.com/#/analyze/zoning-v2/11113420/editor?project=5536&hash=22034d7b6b2f9c709c2b52754a98b554", demo: "DXA", vertical: "Retail", feature: "form_analysis" },
        { url: "https://app.contentsquare.com/#/analyze/navigation-path?project=5536&hash=9f9f4a8b8a75a7ab6db529172874786a", demo: "DXA", vertical: "Banking", feature: "single_journey" },
        { url: "https://app.contentsquare.com/#/analyze/navigation-path?project=5536&hash=9f9f4a8b8a75a7ab6db529172874786a", demo: "DEM", vertical: "Banking", feature: "compare_journey_api_error" },
        { url: "https://app.contentsquare.com/#/analyze/navigation-path?project=5536&hash=9f9f4a8b8a75a7ab6db529172874786a", demo: "DXA", vertical: "Banking", feature: "bank_app_form_analysis" },
        { url: "https://example.com/dxa/lead/link1", demo: "DXA", vertical: "Lead Generation", feature: "" },
        { url: "https://example.com/dxa/lead/link2", demo: "DXA", vertical: "Lead Generation", feature: "" },
        { url: "https://app.contentsquare.com/#/analyze/impact?bootstrapped=true&optimizeFov=true&project=5536&hash=bffac4bd35c3d062f97535a1ea7ae21f", demo: "DEM", vertical: "Retail", feature: "impact_quantification" },
        { url: "https://app.contentsquare.com/quick-playback/index.html?pid=5536&sn=1&visitorIdHashed=15805998181071617123&pvid=5&recordingType=cs&vd=sharing-int", demo: "DEM", vertical: "Retail", feature: "session_replay_api_error" },
        { url: "https://app.contentsquare.com/#/error-analysis/drilldown?project=5536&hash=2f0ac3c9a14f4c0ec4700de2bece7972", demo: "DEM", vertical: "Retail", feature: "error_module_checkout_page" },
        { url: "https://app.contentsquare.com/#/dashboard?project=5536&hash=019bdb9b36bfbd11a8c95ed94c9d13aa", demo: "DXA", vertical: "Retail", feature: "workspace_ecomm" },
        { url: "https://app.contentsquare.com/#/speed-analysis/reports/a_26641e914832b04275ac36134?project=5536&hash=0aa7bbaa272eaf427efcaf62286774c9", demo: "DEM", vertical: "Retail", feature: "speed_analysis_cstore" },
        { url: "https://example.com/dem/banking/link1", demo: "DEM", vertical: "Banking", feature: "" },
        { url: "https://example.com/dem/banking/link2", demo: "DEM", vertical: "Banking", feature: "" },
        { url: "https://example.com/dem/lead/link1", demo: "DEM", vertical: "Lead Generation", feature: "" },
        { url: "https://example.com/dem/lead/link2", demo: "DEM", vertical: "Lead Generation", feature: "" },
        { url: "https://heapanalytics.com/app/env/2761999050/data-galaxy?view=live-data-feed", demo: "PA", vertical: "Retail", feature: "live_data" },
        { url: "https://heapanalytics.com/app/env/2761999050/dashboard/eCommerce-Metrics-MP-254137", demo: "PA", vertical: "Retail", feature: "ecomm_dash_atlas" },
        { url: "https://example.com/pa/banking/link1", demo: "PA", vertical: "Banking", feature: "" },
        { url: "https://example.com/pa/banking/link2", demo: "PA", vertical: "Banking", feature: "" },
        { url: "https://example.com/pa/lead/link1", demo: "PA", vertical: "Lead Generation", feature: "" },
        { url: "https://example.com/pa/lead/link2", demo: "PA", vertical: "Lead Generation", feature: "" }
    ];
}
