//
var HelperFunctions = {
    SetClientApiContext: async function (xrm, formContext) {
        try {
            debugger;
            // Optionally set Xrm and formContext as global variables on the page.
            window.Xrm = xrm;
            console.log(window.Xrm);
            window._formContext = formContext;
            debugger;
            HelperFunctions.SetIncidentList();

        } catch (e) {
            console.log(e.message);
        }
    },

    SetIncidentList: async function () {
        try {
            var accountId = window._formContext.data.entity.getId().replace('{', '').replace('}', '');
           // var incidentList = document.querySelector(".incident-list");

           // incidentList.innerHTML = "";

            var incidents = await HelperAPIFunctions.Get.GetAccountIncidents(accountId);
            var numberOfCases = 0;
            if (incidents != null) {
                 numberOfCases = incidents.length;
            }
            document.getElementById("numberOfCases").textContent = numberOfCases;

           
        }
        catch (e) {
            console.log(e.message);
        }
    }
}


var HelperAPIFunctions = {

    Get: {
        GetAccountIncidents: async function (accountId) {
            return await window.Xrm.WebApi.online.retrieveMultipleRecords("incident", `?$select=casetypecode,incidentid,statecode,statuscode&$filter=_accountid_value eq ${accountId}`)
                .then(
          function success(results) {
                    for (var i = 0; i < results.entities.length; i++) {
                        debugger;
                            var casetypecode = results.entities[i]["casetypecode"];
                            var casetypecode_formatted = results.entities[i]["casetypecode@OData.Community.Display.V1.FormattedValue"];
                            var incidentid = results.entities[i]["incidentid"];
                            var statecode = results.entities[i]["statecode"];
                            var statecode_formatted = results.entities[i]["statecode@OData.Community.Display.V1.FormattedValue"];
                        var statuscode = results.entities[i]["statuscode"];


                        var tableBody = document.getElementById('incident_grid').getElementsByTagName('tbody')[0];

                        // Create a new row
                        var newRow = tableBody.insertRow(tableBody.rows.length);

                        // Create cells and populate them with data
                        var cell1 = newRow.insertCell(0);
                        var cell2 = newRow.insertCell(1);
                        var cell3 = newRow.insertCell(2);
                        var cell4 = newRow.insertCell(3);

                        cell1.innerHTML = incidentid;
                        cell2.innerHTML = casetypecode_formatted;
                        cell3.innerHTML = statecode_formatted;
                        cell4.innerHTML = statuscode;
                        }
                        //Create graph
                        if (results && results.entities && results.entities.length > 0) {
                            var stateCounts = {};

                            // Count occurrences of each statecode
                            results.entities.forEach(entity => {
                                var statecode = entity["statecode"];
                                stateCounts[statecode] = (stateCounts[statecode] || 0) + 1;
                            });

                            // Create a circular chart using Chart.js
                            new Chart(document.getElementById('stateChart').getContext('2d'), {
                                type: 'doughnut',
                                data: {
                                    labels: Object.keys(stateCounts),
                                    datasets: [{
                                        data: Object.values(stateCounts),
                                        backgroundColor: ['#FF5733', '#33FF57', '#3366FF', '#FF33D1'],
                                    }],
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    legend: { display: true, position: 'bottom' },
                                    title: { display: true, text: 'Distribution of Incident States', fontSize: 10 },
                                    cutoutPercentage: 10, 
                                },
                            });
                        }
                    return results.entities;
                      
                
                
                },
                function (error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
        }
    },
}