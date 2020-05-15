/* ============================================= */
/*              DOM variables                    */
/* ============================================= */

const $cardsDiv = $(`#cards-div`);
const $searchBoxInput = $(`#searchBoxInput`);
const $modalContainerDiv = $(`#modalContainer`);
const $modalContentDiv = $(`#modalContentDiv`);

/* ============================================= */
/*              Variables                        */
/* ============================================= */

const numberOfResults = 12;
const apiUrl = `https://randomuser.me/api/?results=${numberOfResults}&nat=us`
let employees = [];
let filteredEmployees = [];
let employeeNavigationTracker = 0;

/* ============================================= */
/*              Helper/Logic functions           */
/* ============================================= */

const convertStringToBoolean = string => {
    return (string === `true`);
};

const convertDateStringToMMDDYY = (dateString) => {
    return moment(dateString).calendar();
}

const checkStatus = (response) => {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
};

const fetchData = (url) => {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log(`Looks like there was a problem fetching the data: ${error}`));
};


const generateEmployeeCard = (employee) => {

    // let's store the employee index as the id of the card div, so it will be easy to know which employee details to show on the modal view
    const cardDivElement = `
    <div id=${employee.index} class="card">
        <img class="avatar" src="${employee.profilePicUrl}" alt="Employee picture">

        <div class="card-description">
            <h2 class="name">${employee.fullName}</h2>
            <p class="contact-card">${employee.email}</p>
            <p class="contact-card">${employee.city}</p>
        </div>
    </div>
    `;

    $cardsDiv.append(cardDivElement);
}

const generateModalView = (employeeId) => {
    
    // get the chosen employee from the array
    const employee = employees[employeeId];

    // populate the modalContentDiv with employee details
    const modalContent = `
        <span class="btn btn-close">X</span>
        <img class="avatar-modal" src="${employee.profilePicUrl}" alt="Employee picture">
        <h2 class="name-modal">${employee.fullName}</h2>
        <p class="contact-modal">${employee.email}</p>
        <p class="contact-modal">${employee.city}</p>
        <span class="btn btn-prev"><</span>
        <span class="btn btn-next">></span>
        <p class="contact-modal top-separator">${employee.phone}</p>
        <p class="contact-modal">${employee.fullAddress}</p>
        <p class="contact-modal">${employee.dateOfBirth}</p>
    `;

    $modalContentDiv.html(modalContent);

    // show modal view
    $modalContainerDiv.show();
}

const showPrevEmployee = () => {
    if (employeeNavigationTracker > 0) {
        employeeNavigationTracker--;
        generateModalView(employeeNavigationTracker);

        return;
    }

    console.log(`Either there's no previous employee or next employee in the array. Doing nothing`);
}

const showNextEmployee = () => {
    if (employeeNavigationTracker < employees.length - 1) {
        employeeNavigationTracker++;
        generateModalView(employeeNavigationTracker);

        return;
    }

    console.log(`Either there's no previous employee or next employee in the array. Doing nothing`);
}

const clearModalView = () => {
    $modalContentDiv.html(``);
    $modalContainerDiv.hide();
}

const parseEmployeeJSON = (jsonData) => {
    // loop through the jsonData array
    jsonData.results.forEach((employeeData, index) => {
        const fullName = `${employeeData.name.first} ${employeeData.name.last}`;
        const email = employeeData.email;
        const city = employeeData.location.city;
        const fullAddress = `${employeeData.location.street.number} ${employeeData.location.street.name}, ${employeeData.location.state} ${employeeData.location.postcode}`
        const phone = employeeData.phone;
        const dateOfBirth = `Birthday: ${convertDateStringToMMDDYY(employeeData.dob.date)}`;
        const profilePicUrl = employeeData.picture.large;

        const employee = {
            index, 
            fullName,
            email,
            city,
            fullAddress,
            phone,
            dateOfBirth,
            profilePicUrl
        };

        employees.push(employee); // store employee to our employees array so we can use it for searching later

        generateEmployeeCard(employee);
    })
};


/* ============================================= */
/*              On page load                     */
/* ============================================= */

// A $( document ).ready() block. This is fired when the page is completely loaded
$(document).ready( ()=> {
    fetchData(apiUrl)
        .then(parseEmployeeJSON)
});

/* ============================================= */
/*              Event listeners                  */
/* ============================================= */

$cardsDiv.on(`click`, `.card`, (event) => {

    console.log(event.target);

    // get the card's employee index
    const cardClicked = event.target.closest(`.card`); // useful method that allows us to traverse up the tree until it finds the node that matches the selection

    const cardClickedId = cardClicked.id; // this returns a string. still need to convert to int
    const idAsInteger = parseInt(cardClickedId);

    employeeNavigationTracker = idAsInteger;
    console.log(`event target id: ${cardClickedId}`);
    console.log(`event target id number: ${idAsInteger}`);
    

    // show that employee on the modal view
    generateModalView(employeeNavigationTracker);
});

$modalContentDiv.on(`click`, `span`, (event) => {

    const spanClicked = event.target;

    if ($(spanClicked).hasClass(`btn-close`)) {
        // hide the modal view
        employeeNavigationTracker = 0;

        clearModalView();
    } else if ($(spanClicked).hasClass(`btn-prev`)) {
        // navigate to prev employee
        console.log(`Showing previous employee`);
        
        showPrevEmployee();
    } else {
        // navigate to next employee
        console.log(`Showing next employee`);

        showNextEmployee();
    }
});

$searchBoxInput.on(`keyup`, (event) => {
    const searchString = $(event.target).val().toLowerCase();

    const $employeeCardDivs = $(`.card`);
    
    // if searchString is empty, simply display all employees
    if (searchString === ``) {
        $employeeCardDivs.each( (index, card) => {
            $(card).show();
        });

        return;
    }

    // loop through the employee cards div
    $employeeCardDivs.each((index, card) => {
        // get the employee name
        const employeeName = employees[index].fullName.toLowerCase();

        if(employeeName.substr(0, searchString.length).toLowerCase() === searchString) {
            // there's a match!
            // if match, show that card
            $(card).show();
        } else {
            // if no match, hide that card
            $(card).hide();
        }

    });
});