/* ============================================= */
/*              DOM variables                    */
/* ============================================= */

const $cardsDiv = $(`#cards-div`);
const $searchBoxInput = $(`#searchBoxInput`);
const $modalContentDiv = $(`#modalContentDiv`);

/* ============================================= */
/*              Variables                        */
/* ============================================= */

const numberOfResults = 12;
const apiUrl = `https://randomuser.me/api/?results=${numberOfResults}&nat=us`
let employees = [];

/* ============================================= */
/*              Helper functions                 */
/* ============================================= */

const convertStringToBoolean = string => {
    return (string === `true`);
};

const convertDateStringToMMDDYY = (dateString) => {
    console.log(dateString);
    
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
    console.log(employee)

    const cardDivElement = `
    <div class="card">
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

    const cardClicked = event.target;
    const cardClickedId = event.target.id;

    // get the card's employee info

    // look for that employee in the employees array

    // show the modal view and fill it up with that employee's info

    //todo: continue here. need to populate the modal card 
    
});

$modalContentDiv.on(`click`, `span`, (event) => {

    const spanClicked = event.target;

    if ($(spanClicked).hasClass(`btn-close`)) {
        // hide the modal view
    } else if ($(spanClicked).hasClass(`btn-prev`)) {
        // if there is a prev employee in the array, fill up with prev employee's info

        // if none, do nothing
    } else {
        // if there is a next employee in the array, fill up with next employee's info

        // if none, do nothing
    }
});