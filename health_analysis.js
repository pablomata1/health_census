const addPatientButton = document.getElementById('addPatient');
const report = document.getElementById('report');
const btnSearch = document.getElementById('btnSearch');
const patients = [];

function addPatient(){
    const name = document.getElementById('name').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById('age').value;
    const condition = document.getElementById('condition').value;
    console.log('in addPatient fucntion');
    if(name && gender && age && condition){
        patients.push({ name, 
                        gender: gender.value,
                        age,
                        condition });
        
        resetForm();
        generateReport();
    }

    console.log(patients);
}

function resetForm(){
    document.getElementById('name').value = '';
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById('age').value = '';
    document.getElementById('condition').value = '';

}


function searchCondition(){
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv =document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('health_analysis.json')
        //turns the response into a json format
        .then(response => response.json())
        .then(data => {
            //searches for condition from data using find method
            const condition = data.conditions.find(item => item.name.toLowerCase() === input);

            if(condition){
                //joins the array into a single string and seperating them by ', '
                const symptoms = condition.symptoms.join(', ');
                const prevention = condition.prevention.join(', ');
                const treatment = condition.treatment;

                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
                resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;


            }else{
                //if condition is not found, display message
                resultDiv.innerHTML = 'Condition not fount'
            }
        })
        //catch any error
        .catch(error => {
            console.error('Error: ', error);
            resultDiv.innerHTML = 'An error occured while fetching data.';
        }) 
}

btnSearch.addEventListener('click', searchCondition);



//Display a report of number of patients, and total amount of conditions
function generateReport(){
    //Total number of paitents
    const numPatients = patients.length;

    //An object to keep track off how many conditions
    //"High Blood Pressure" is formated this way because it has multiple words, so it is set as string
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        'High Blood Pressure': 0,
    };

    //An object to keep track of Femal and Male conditions
    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
    };
    
    //Iterates through the patients[] array: Utilizes a for…of loop to iterate through each patient's data within the patients[] array
    //Increment condition counts: Increments the count for each patient's specific medical condition in the conditionsCount object.
    //2 ways to access objects: 
    //1- object.property
    //2 - object[propert]
    for(const patient of patients){
        conditionsCount[patient.condition]++;
        genderConditionsCount[patient.gender][patient.condition]++;
    }
    
    //Headings for report: Number of patients and conditions
    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br>`;
    //Itterates the object, iterates thru conditions
    for(const condition in conditionsCount){
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    //Heading for report: Gender Based Conditions
    report.innerHTML += `<br>Gender-Based Conditions:<br>`;
    for (const gender in genderConditionsCount) {
        report.innerHTML += `${gender}:<br>`;
        for (const condition in genderConditionsCount[gender]){
        report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        }
    }

}

//triggers adding patient button 
addPatientButton.addEventListener("click", addPatient);
