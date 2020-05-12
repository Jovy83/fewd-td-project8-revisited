/* ============================================= */
/*              DOM variables                    */
/* ============================================= */

const $cardsDiv = $("#cards-div");
const $searchBoxInput = $("#searchBoxInput");

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

    // TODO: continue here
    const cardDivElement = `
    <div class="card">
        <img class="avatar" src="${employee.profilePicUrl}" alt="Employee picture">

        <div class="card-description">
            <h2 class="name">${employee.fullName}</h2>
            <p class="email">${employee.email}</p>
            <p class="location">${employee.city}</p>
        </div>
    </div>
    `;

    $cardsDiv.append(cardDivElement);


}

const parseEmployeeJSON = (jsonData) => {
    // loop through the jsonData array
    jsonData.results.forEach(employeeData => {
        const fullName = `${employeeData.name.first} ${employeeData.name.last}`;
        const email = employeeData.email;
        const city = employeeData.location.city;
        const fullAddress = `${employeeData.location.street.number} ${employeeData.location.street.name}, ${employeeData.location.state} ${employeeData.location.postcode}`
        const phone = employeeData.phone;
        const dateOfBirth = `Birthday: ${convertDateStringToMMDDYY(employeeData.dob.date)}`;
        const profilePicUrl = employeeData.picture.large;

        const employee = {
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