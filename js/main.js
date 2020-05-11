/* ============================================= */
/*              DOM variables                    */
/* ============================================= */

const $cardsDiv = $("#cards-div");

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

        const employee = {
            fullName,
            email,
            city,
            fullAddress,
            phone,
            dateOfBirth
        };

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