// TODO: refactor, and user inputted assumed returns and limit inflation rate.
// 

document.addEventListener('DOMContentLoaded', function() {
    let inflation = 3.0/100;
    
    // Initial S&P returns to reset to
    const initialYears = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
    const initialLimits = [5000, 5000, 5000, 5000, 5500, 5500, 10000, 5500, 5500, 5500, 6000, 6000, 6000, 6000, 6500, 7000];
    const initialSpReturns = [26.46, 15.06, 2.11, 16.00, 32.39, 13.69, 1.38, 11.96, 21.83, -4.38, 31.49, 18.40, 28.71, -18.11, 26.29, 21.55];
    
    let averageReturn = initialSpReturns.reduce((a,b)=>a+b)/initialSpReturns.length

    // Copy of initial returns used for calculation
    let years = [...initialYears]
    let tfsaLimits = [...initialLimits]
    let spReturns = [...initialSpReturns];
    let contributions = [...tfsaLimits]; // Initialize contributions to match tfsaLimits by default

    const tableBody = document.querySelector('#investmentTable tbody');
    const addRowBtn = document.getElementById('addRowBtn');
    const deleteRowBtn = document.getElementById('deleteRowBtn');

    const contributionsLimitBtn = document.getElementById('setContributionsLimitBtn');
    const contributionsZeroBtn = document.getElementById('setContributionsZeroBtn');
    const resetLimitsBtn = document.getElementById('resetLimitsBtn');

    const resetReturnsBtn = document.getElementById('resetReturnsBtn');
    const startYearInput = document.getElementById('startYear');

    const inflationInput = document.getElementById('inflationRate');
    const returnInput = document.getElementById('assumedReturn');

    let currentStartYear = parseInt(startYearInput.value);

    function assumedLimit(years){
        return Math.round(initialLimits[initialLimits.length-1]*(1+inflation)**(years)/500)*500
    }

    function getAssumedLimits(){
        return Array.from({length:tfsaLimits.length-initialLimits.length},(_,index)=>assumedLimit(index+1));
    }

    let eoyTotal = 0;
    let cumulativeContribution = 0;
    let contributionRoom = 0;


    function updateTable(recreate=true,ignore_id = null){   
        cumulativeContribution = 0; // Reset cumulativeContribution before recalculation
        contributionRoom = 0 
        eoyTotal = 0; // Reset eoyTotal before recalculation

        if(recreate){
            tableBody.innerHTML = '';
        }

        years.forEach((year,index) => {
            const limit = tfsaLimits[index];
            const spReturn = spReturns[index];
            const contribution = contributions[index];
            let startYear = parseInt(startYearInput.value);

            cumulativeContribution += contribution;
            eoyTotal = index === 0 
                ? contribution * (1 + spReturn / 100) 
                : (eoyTotal + contribution) * (1 + spReturn / 100);

            contributionRoom += limit

            if(!recreate){
                 // Example: Set all "limit" input fields to a specific value
                const limitInput = document.getElementById(`limit-${year}`);
                if (limitInput&&ignore_id!=`limit-${year}`) {
                    limitInput.value = limit.toFixed(2);  // Set limit value to 5000
                }

                // Example: Set "contribution" input fields to a specific value
                const contributionInput = document.getElementById(`contribution-${year}`);
                if (contributionInput&&ignore_id!=`contribution-${year}`) {
                    contributionInput.value = contribution.toFixed(2);  // Set contribution value to 5000
                }

                // Example: Set "spReturn" input fields to a specific value
                const spReturnInput = document.getElementById(`spReturn-${year}`);
                if (spReturnInput&&ignore_id!=`spReturn-${year}`) {
                    spReturnInput.value = spReturn.toFixed(2);  // Set S&P return value to 5
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
            }else{
                const rowElement = document.createElement('tr');

                rowElement.id = `row-${year}`;  // Assigning a unique ID using the year
    
                // Create table row dynamically with input fields for contributions and S&P return
                rowElement.innerHTML = `
                <td id="year-${year}">${year}</td>
                <td><span class="currencyinput"><input type="number" id="limit-${year}" value="${limit.toFixed(2)}" class="limit-input"></span></td>
                <td id="contributionRoom-${year}">$${contributionRoom.toFixed(2)}</td>
                <td><span class="currencyinput"><input type="number" id="contribution-${year}" value="${contribution.toFixed(2)}" class="contribution-input"></span></td>
                <td id="cumulativeContribution-${year}">$${cumulativeContribution.toFixed(2)}</td>
                <td><input type="number" id="spReturn-${year}" value="${spReturn.toFixed(2)}" class="sp-input"></td>
                <td id="eoyTotal-${year}">$${eoyTotal.toFixed(2)}</td>
            `;
             
                // Hide rows if the year is less than the start year
                if (year < startYear) {
                    rowElement.style.display = 'none';
                }
                
                tableBody.appendChild(rowElement);
            }

            contributionRoom -= contribution
        }); 

        if(recreate){
              // Add event listeners to contribution inputs
        const contributionInputs = document.querySelectorAll('.contribution-input');
        contributionInputs.forEach((input, index) => {
            input.addEventListener('input', (event) => {
                contributions[index] = parseFloat(event.target.value) || 0; // Update contributions
                updateTable(false,event.target.id); // Re-populate the table to reflect the changes
            });
            input.addEventListener('blur', (event) => {
                contributions[index] = parseFloat(event.target.value) || 0; // Update contributions
                updateTable(false); // Re-populate the table to reflect the changes
            });
        });

         // Add event listeners to contribution inputs
         const spInputs = document.querySelectorAll('.sp-input');
         spInputs.forEach((input, index) => {
             input.addEventListener('input', (event) => {
                 spReturns[index] = parseFloat(event.target.value) || 0; // Update contributions
                 updateTable(false,event.target.id); // Re-populate the table to reflect the changes
             });
             input.addEventListener('blur', (event) => {
                spReturns[index] = parseFloat(event.target.value) || 0; // Update contributions
                updateTable(false); // Re-populate the table to reflect the changes
            });
         });

         
         // Add event listeners to contribution inputs
         const limitInputs = document.querySelectorAll('.limit-input');
         limitInputs.forEach((input, index) => {
             input.addEventListener('input', (event) => {
                 tfsaLimits[index] = parseFloat(event.target.value) || 0; // Update contributions
                 updateTable(false,event.target.id); // Re-populate the table to reflect the changes
             });
             input.addEventListener('blur', (event) => {
                tfsaLimits[index] = parseFloat(event.target.value) || 0; // Update contributions
                updateTable(false); // Re-populate the table to reflect the changes
            });
         });    
        }

    }


    function addRow() {
        const lastYear = years[years.length - 1];
        const newYear = lastYear + 1;
        let newReturn = initialSpReturns[newYear-initialYears[0]];
        let newLimit = initialLimits[newYear-initialYears[0]];

        if(newYear>initialYears[initialYears.length-1]){
            newReturn = averageReturn;
            const compoundingYears = newYear-initialYears[initialYears.length-1]
            newLimit = assumedLimit(compoundingYears)
        }
       

        years.push(newYear);
        tfsaLimits.push(newLimit);  
        spReturns.push(newReturn);    
        contributions.push(newLimit); // Default contribution for new rows

        updateTable();
    }

    function deleteRow() {
        years.pop();
        tfsaLimits.pop();  
        spReturns.pop();    
        contributions.pop(); // Default contribution for new rows
        updateTable();
    }



    function resetLimits(finalYear = null){
        const startIndex = parseInt(startYearInput.value)-initialYears[0];
        let endIndex = tfsaLimits.length
        if(finalYear!==null){
            endIndex = finalYear-initialYears[0]+1
        }
        
        for(i = startIndex; i<endIndex;i++){
            if(i<initialLimits.length){
                tfsaLimits[i] = initialLimits[i]
            }else{
                tfsaLimits[i] = assumedLimit(i-initialLimits.length+1)
            }
            
        }
        updateTable(); // Re-populate the table to reflect the changes
    }

    function resetContributionsToLimits(finalYear = null) {
        let endIndex = tfsaLimits.length
        if(finalYear!==null){
            endIndex = finalYear-initialYears[0]+1
        }
        for(i = 0; i<endIndex;i++){
            contributions[i] = tfsaLimits[i]
        }
        updateTable(); // Re-populate the table to reflect the changes
    }

    function resetContributionsToZero() {
        contributions.splice(0,contributions.length,...Array(contributions.length).fill(0)); // Reset all contributions to match TFSA limits
        updateTable(); // Re-populate the table to reflect the changes
    }

    function resetSpReturns() {
        spReturns.splice(0,initialSpReturns.length,...initialSpReturns); // Reset all S&P returns to their initial values
        // Reset S&P returns to assumed values
        spReturns.splice(initialSpReturns.length,spReturns.length-initialSpReturns.length,...Array(spReturns.length-initialSpReturns.length).fill(averageReturn));
        updateTable(); // Re-populate the table to reflect the changes
    }

    function updateStartYear() {
        const startYear = parseInt(startYearInput.value);
        if(startYear-initialYears[0]>=0){
            tfsaLimits.splice(0,startYear-initialYears[0],...Array(startYear-initialYears[0]).fill(0)); //set TFSA limits of years before start to 0
            contributions.splice(0,startYear-initialYears[0],...Array(startYear-initialYears[0]).fill(0)); // set contributions of years before start to 0
            
        }
       
        resetLimits(Math.max(startYear,currentStartYear))
        resetContributionsToLimits(Math.max(startYear,currentStartYear))

        currentStartYear = startYear
        updateTable(); // Re-populate the table to reflect the changes
    }

    // Event listeners for buttons and input changes
    addRowBtn.addEventListener('click', addRow);
    deleteRowBtn.addEventListener('click', deleteRow);

    resetLimitsBtn.addEventListener('click',()=>resetLimits())
    contributionsLimitBtn.addEventListener('click', ()=>resetContributionsToLimits());
    contributionsZeroBtn.addEventListener('click', resetContributionsToZero);

    resetReturnsBtn.addEventListener('click', resetSpReturns);
    startYearInput.addEventListener('input', updateStartYear);

    function updateInflationAndReturn() {
        inflation = parseFloat(inflationInput.value) / 100;
        averageReturn = parseFloat(returnInput.value);
    
        resetLimits(); // Reapply assumptions with updated inflation and return rates
        resetSpReturns();
        updateTable();
    }
    
    document.getElementById('inflationRate').addEventListener('input', updateInflationAndReturn);
    document.getElementById('assumedReturn').addEventListener('input', updateInflationAndReturn);
    

    updateTable();
    updateInflationAndReturn()
});
