// @flow
import { Component } from '@angular/core';
<%_ if(filters.uirouter) { -%>
import { StateService } from 'ui-router-ng2';<% } %>
<%_ if(filters.ngroute) { -%>
import { Router } from '@angular/router';<% } %><% if(filters.mongoose) { %>
import { ValidationError } from 'mongoose';<% } %>
import { AuthService } from '../../../components/auth/auth.service';

<%_ if(filters.flow) { -%>
type User = {
    name: string;
    email: string;
    password: string;
};<% } %><%_ if(filters.ts) { -%>
interface User {
    name: string;
    email: string;
    password: string;
}<% } %>

@Component({
    selector: 'signup',
    template: require('./signup.<%=templateExt%>'),
})
export class SignupComponent {
    user: User = {
        name: '',
        email: '',
        password: ''
    };
    errors: {field?: Error} = {};
    submitted = false;
    AuthService;
    <%_ if(filters.ngroute) { -%>
    Router;<% } %>
    <%_ if(filters.uirouter) { -%>
    StateService;<% } %>

    static parameters = [AuthService, <% if(filters.ngroute) { %>Router<% } else { %>StateService<% } %>];
    constructor(_AuthService_: AuthService, <% if(filters.ngroute) { %>router: Router<% } else { %>_StateService_: StateService<% } %>) {
        this.AuthService = _AuthService_;
        <%_ if(filters.ngroute) { -%>
        this.Router = router;<% } -%>
        <%_ if(filters.uirouter) { -%>
        this.StateService = _StateService_;<% } -%>
    }

    register(form) {
        if(form.invalid) return;

        this.submitted = true;

        return this.AuthService.createUser({
            name: this.user.name,
            email: this.user.email,
            password: this.user.password
        })
            .then(() => {
                // Account created, redirect to home<% if(filters.ngroute) { %>
                this.Router.navigateByUrl('/home');<% } %><% if(filters.uirouter) { %>
                this.StateService.go('main');<% } %>
            })<% if(filters.mongooseModels) { %>
            .catch((err: {errors: {field: ValidationError}}) => {
                this.errors = err.errors;

                // Update validity of form fields that match the mongoose errors
                Object.entries(err.errors).forEach(([field, error]: [string, ValidationError]) => {
                    this.errors[field] = error.message;

                    if(field === 'email' && error.kind === 'user defined') {
                    form.form.controls[field].setErrors({inUse: true});
                }
                });<% } %><% if(filters.sequelizeModels) { %>
            .catch(err => {
                this.errors = {};

                // Update validity of form fields that match the sequelize errors
                if(err.name) {
                    err.fields.forEach(field => {
                        this.errors[field] = err.message;
                    });
                }<% } %>

                this.submitted = false;
            });
    }
}
