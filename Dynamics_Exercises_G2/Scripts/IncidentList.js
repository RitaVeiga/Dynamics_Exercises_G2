//
var HelperFunctions = {
    SetClientApiContext: async function (xrm, formContext) {
        try {
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
            var incidentList = document.querySelector(".incident-list");

           // incidentList.innerHTML = "";

            var incidents = await HelperAPIFunctions.Get.GetAccountIncidents(accountId);

            //for (var i = 0; i < incidents.length; i++) {
            //    var incidentItem = document.createElement("li");
            //    incidentItem.innerHTML = `${incidents[i]["casetitle"]}, ${incidents[i]["status"]}`;
            //    incidentList.appendChild(incidentItem);
            //}
        }
        catch (e) {
            console.log(e.message);
        }
    }
}


var HelperAPIFunctions = {

    Get: {
        GetAccountIncidents: async function (accountId) {
            return await window.Xrm.WebApi.online.retrieveMultipleRecords("incident", `?$select=caseorigincode,casetypecode,cre98_customcasetype,statecode,title&$filter=_accountid_value eq ${accountId}`).then(
                function success(results) {
                    debugger;
                    return results.entities;
                },
                function (error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
        }
    },
}