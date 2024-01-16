import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import ListBinding from "sap/ui/model/ListBinding";
import { Urgency } from "../format/util";
/**
 * @namespace ns.manager.controller
 */
export default class SpotStatus extends Controller {

    private statusFilters: Filter[] = [];

    public onInit() {

    }

    onFilterSelect(event: IconTabBar$SelectEvent): void {

        const listBinding = this.getView()?.byId("incidentList")?.getBinding("items") as ListBinding;
        const key = event.getParameter("key");

        if (key === Urgency.Low) {
            this.statusFilters = [new Filter("urgency", FilterOperator.EQ, Urgency.Low, false)];
        } else if (key === Urgency.Medium) {
            this.statusFilters = [new Filter("urgency", FilterOperator.EQ, Urgency.Medium, false)];
        } else if (key === Urgency.High) {
            this.statusFilters = [new Filter("urgency", FilterOperator.EQ, Urgency.High, false)];
        } else {
            this.statusFilters = [];
        }

        listBinding.filter(this.statusFilters);
    }

    navToMain() {
        UIComponent.getRouterFor(this).navTo("RouteMain");
    }

}