import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import {AuthPage} from './pages/AuthPage'
import {HomePage} from "./pages/HomePage";
import {ClientAddPage} from "./pages/Client/ClientAddPage";
import {ClientListPage} from "./pages/Client/ClientListPage";
import {ClientEditPage} from "./pages/Client/ClientEditPage";
import {ClientReportPage} from "./pages/Client/ClientReportPage";
import {WorksitesAddPage} from "./pages/Worksites/WorksitesAddPage";
import {WorksitesListPage} from "./pages/Worksites/WorksitesListPage";
import {WorksitesEditPage} from "./pages/Worksites/WorksitesEditPage";
import {JobAddPage} from "./pages/Job/JobAddPage";
import {JobListPage} from "./pages/Job/JobListPage";
import {JobEditPage} from "./pages/Job/JobEditPage";
import {EmployeesAddPage} from "./pages/Employees/EmployeesAddPage";
import {EmployeesListPage} from "./pages/Employees/EmployeesListPage";
import {EmployeesEditPage} from "./pages/Employees/EmployeesEditPage";
import {EquipmentAddPage} from "./pages/Equipment/EquipmentAddPage";
import {EquipmentListPage} from "./pages/Equipment/EquipmentListPage";
import {EquipmentEditPage} from "./pages/Equipment/EquipmentEditPage";
import {MonthlyEarningsReport} from "./pages/Reports/MonthlyEarningsReport";

export const useRoutes = isAuthenticated => {

    return (
        <Switch>
            <Route path="/" exact>
                <HomePage />
            </Route>
            <Route path="/client" exact>
                <ClientAddPage />
            </Route>
            <Route path="/client/list" exact>
                <ClientListPage />
            </Route>
            <Route path="/client/:id/edit">
                <ClientEditPage />
            </Route>
            <Route path="/client/:id/report">
                <ClientReportPage />
            </Route>
            <Route path="/worksites" exact>
                <WorksitesAddPage />
            </Route>
            <Route path="/worksites/list" exact>
                <WorksitesListPage />
            </Route>
            <Route path="/worksites/:id/edit">
                <WorksitesEditPage />
            </Route>
            <Route path="/job" exact>
                <JobAddPage />
            </Route>
            <Route path="/job/list" exact>
                <JobListPage />
            </Route>
            <Route path="/job/:id/edit" exact>
                <JobEditPage />
            </Route>
            <Route path="/employees" exact>
                <EmployeesAddPage />
            </Route>
            <Route path="/employees/list" exact>
                <EmployeesListPage />
            </Route>
            <Route path="/employees/:id/edit">
                <EmployeesEditPage />
            </Route>
            <Route path="/equipment" exact>
                <EquipmentAddPage />
            </Route>
            <Route path="/equipment/list" exact>
                <EquipmentListPage />
            </Route>
            <Route path="/equipment/:id/edit">
                <EquipmentEditPage />
            </Route>
            <Route path="/MonthlyEarningsReport" exact>
                <MonthlyEarningsReport />
            </Route>
            <Route path="/login" exact>
                <AuthPage />
            </Route>
            <Redirect to="/login" />
        </Switch>
    )
}
