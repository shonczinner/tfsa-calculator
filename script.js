document.addEventListener('DOMContentLoaded', function() {
    // Separate lists for each column's data
    
    
    
    // Initial S&P returns to reset to
    const initialYears = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
    const initialLimits = [5000, 5000, 5000, 5000, 5500, 5500, 10000, 5500, 5500, 5500, 6000, 6000, 6000, 6000, 6500, 7000];
    const initialSpReturns = [26.46, 15.06, 2.11, 16.00, 32.39, 13.69, 1.38, 11.96, 21.83, -4.38, 31.49, 18.40, 28.71, -18.11, 26.29, 21.55];
    
    // Copy of initial returns used for calculation
    let years = [...initialYears]
    let tfsaLimits = [...initialLimits]
    let spReturns = [...initialSpReturns];
    let contributions = [...tfsaLimits]; // Initialize contributions to match tfsaLimits by default

    const tableBody = document.querySelector('#investmentTable tbody');
    const addRowBtn = document.getElementById('addRowBtn');
    const resetContributionsBtn = document.getElementById('resetContributionsBtn');
    const resetReturnsBtn = document.getElementById('resetReturnsBtn');
    const startYearInput = document.getElementById('startYear');

    let eoyTotal = 0;
    let cumulativeContribution = 0;
    let contributionRoom = 0;

    function changeTable(){

        cumulativeContribution = 0; // Reset cumulativeContribution before recalculation
        contributionRoom = 0 
        eoyTotal = 0; // Reset eoyTotal before recalculation

        years.forEach((year,index) => {
            const limit = tfsaLimits[index];
            const spReturn = spReturns[index];
            const contribution = contributions[index];

            cumulativeContribution += contribution;
            eoyTotal = index === 0 
                ? contribution * (1 + spReturn / 100) 
                : (eoyTotal + contribution) * (1 + spReturn / 100);

            contributionRoom += limit 
            
            contributionRoom -= contribution
            
            // Example: Set all "limit" input fields to a specific value
            const limitInput = document.getElementById(`limit-${year}`);
            if (limitInput) {
                limitInput.value = limit;  // Set limit value to 5000
            }

            // Example: Set "contribution" input fields to a specific value
            const contributionInput = document.getElementById(`contribution-${year}`);
            if (contributionInput) {
                contributionInput.value = contribution;  // Set contribution value to 5000
            }

            // Example: Set "spReturn" input fields to a specific value
            const spReturnInput = document.getElementById(`spReturn-${year}`);
            if (spReturnInput) {
                spReturnInput.value = spReturn;  // Set S&P return value to 5
            }

            // Set text content for non-input fields
            const contributionRoomCell = document.getElementById(`contributionRoom-${year}`);
            if (contributionRoomCell) {
                contributionRoomCell.textContent = "$"+contributionRoom.toFixed(2);  // Set contribution room to $5000
            }

            const cumulativeContributionCell = document.getElementById(`cumulativeContribution-${year}`);
            if (cumulativeContributionCell) {
                cumulativeContributionCell.textContent = '$'+cumulativeContribution.toFixed(2);  // Set cumulative contribution to $5000
            }

            const eoyTotalCell = document.getElementById(`eoyTotal-${year}`);
            if (eoyTotalCell) {
                eoyTotalCell.textContent = '$'+eoyTotal.toFixed(2);  // Set EOY total value to $5000
            }
        }); 

    }

    function populateTable() {
        const startYear = parseInt(startYearInput.value);

      
        cumulativeContribution = 0; // Reset cumulativeContribution before recalculation
        contributionRoom = 0 
        eoyTotal = 0; // Reset eoyTotal before recalculation

        tableBody.innerHTML = '';
        years.forEach((year, index) => {
            const limit = tfsaLimits[index];
            const spReturn = spReturns[index];
            const contribution = contributions[index];

            cumulativeContribution += contribution;
            eoyTotal = index === 0 
                ? contribution * (1 + spReturn / 100) 
                : (eoyTotal + contribution) * (1 + spReturn / 100);

            contributionRoom += limit 
            
        
            const rowElement = document.createElement('tr');

            rowElement.id = `row-${year}`;  // Assigning a unique ID using the year

            // Create table row dynamically with input fields for contributions and S&P return
            rowElement.innerHTML = `
            <td id="year-${year}">${year}</td>
            <td><span class="currencyinput"><input type="number" id="limit-${year}" value="${limit}" class="limit-input"></span></td>
            <td id="contributionRoom-${year}">$${contributionRoom}</td>
            <td><span class="currencyinput"><input type="number" id="contribution-${year}" value="${contribution}" class="contribution-input"></span></td>
            <td id="cumulativeContribution-${year}">$${cumulativeContribution.toFixed(2)}</td>
            <td><input type="number" id="spReturn-${year}" value="${spReturn}" class="sp-input"></td>
            <td id="eoyTotal-${year}">$${eoyTotal.toFixed(2)}</td>
        `;
        
            

            // Hide rows if the year is less than the start year
            if (year < startYear) {
                rowElement.style.display = 'none';
            }
            
            tableBody.appendChild(rowElement);

            contributionRoom -= contribution
        });


        // Add event listeners to contribution inputs
        const contributionInputs = document.querySelectorAll('.contribution-input');
        contributionInputs.forEach((input, index) => {
            input.addEventListener('input', (event) => {
                contributions[index] = parseFloat(event.target.value) || 0; // Update contributions
                changeTable(); // Re-populate the table to reflect the changes
            });
        });

         // Add event listeners to contribution inputs
         const spInputs = document.querySelectorAll('.sp-input');
         spInputs.forEach((input, index) => {
             input.addEventListener('input', (event) => {
                 spReturns[index] = parseFloat(event.target.value) || 0; // Update contributions
                 changeTable(); // Re-populate the table to reflect the changes
             });
         });

         
         // Add event listeners to contribution inputs
         const limitInputs = document.querySelectorAll('.limit-input');
         limitInputs.forEach((input, index) => {
             input.addEventListener('input', (event) => {
                 tfsaLimits[index] = parseFloat(event.target.value) || 0; // Update contributions
                 changeTable(); // Re-populate the table to reflect the changes
             });
         });
    }

    function addRow() {
        const lastYear = years[years.length - 1];
        const newYear = lastYear + 1;

        years.push(newYear);
        tfsaLimits.push(tfsaLimits[tfsaLimits.length - 1]);  
        spReturns.push(spReturns.reduce((a,b)=>a+b)/spReturns.length);    
        contributions.push(tfsaLimits[tfsaLimits.length - 1]); // Default contribution for new rows

        populateTable();
    }

    function resetContributionsAndLimits() {
        contributions.splice(0,initialLimits.length,...initialLimits); // Reset all contributions to match TFSA limits
        tfsaLimits.splice(0,initialLimits.length,...initialLimits); // Reset all contributions to match TFSA limits
        updateStartYear()
    }

    function resetSpReturns() {
        spReturns.splice(0,initialSpReturns.length,...initialSpReturns); // Reset all S&P returns to their initial values
        populateTable(); // Re-populate the table to reflect the changes
    }

    function updateStartYear() {
        const startYear = parseInt(startYearInput.value);
        tfsaLimits.splice(0,startYear-initialYears[0],...Array(startYear-initialYears[0]).fill(0)); // Reset all contributions to match TFSA limits
        tfsaLimits.splice(startYear-initialYears[0],Infinity,...initialLimits.slice(startYear-initialYears[0])); // Reset all contributions to match TFSA limits
        contributions.splice(0,startYear-initialYears[0],...Array(startYear-initialYears[0]).fill(0)); // Reset all contributions to match TFSA limits
        populateTable(); // Re-populate the table to reflect the changes
    }

    // Event listeners for buttons and input changes
    addRowBtn.addEventListener('click', addRow);
    resetContributionsBtn.addEventListener('click', resetContributionsAndLimits);
    resetReturnsBtn.addEventListener('click', resetSpReturns);
    startYearInput.addEventListener('input', updateStartYear);

    populateTable();
});
