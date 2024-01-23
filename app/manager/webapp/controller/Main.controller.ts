import Controller from "sap/ui/core/mvc/Controller";

/**
 * @namespace ns.manager.controller
 */
export default class Main extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }

    navToSpotStatus(event: GeoMap$KeyPressEvent) {
        const spotIndex = event.getSource().getBindingContext("spotModel")?.getProperty("index");
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteSpotStatus", {index: spotIndex});
    }
}