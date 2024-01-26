var AccountHelper = {

    OnLoad: {
        OnMainFormLoads: function (executionContext) {
            try {
                debugger;
                GeneralHelperFunctions.SetContentToWebResource(executionContext);
            } catch (e) {
                console.log(e.message);
            }
        },

    },

    OnClick: {

    }
}

var GeneralHelperFunctions = {
    SetContentToWebResource: function (executionContext) {
        try {
            var formContext = executionContext.getFormContext();
            debugger;
            var wrControl = formContext.getControl("WebResource_IncidentList_G2");
            if (wrControl !== null) {
                wrControl.getContentWindow().then(
                    function (contentWindow) {
                        contentWindow.HelperFunctions.SetClientApiContext(Xrm, formContext);
                    }
                )
            }
        } catch (e) {
            console.log(e.message);
        }
    }
}