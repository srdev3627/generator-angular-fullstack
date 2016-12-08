import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
<%_ if(filters.uirouter) { %>
import { UIRouterModule } from 'ui-router-ng2';<% } %>
<%_ if(filters.ngroute) { %>
import { RouterModule, Routes } from '@angular/router';<% } %>
<%_ if(filters.uibootstrap) { %>
import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';<% } %>

import { MainComponent } from './main.component';
<%_ if(filters.socketio) { -%>
import { SocketService } from '../../components/socket/socket.service';<% } %>

<%_ if(filters.ngroute) { _%>
export const ROUTES: Routes = [
  { path: '', component: MainComponent },
];<% } %>
<%_ if(filters.uirouter) { _%>
export const STATES = [
  { name: 'main', url: '/', component: MainComponent },
];<% } %>

export let MainModule = @NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        <%_ if(filters.ngroute) { _%>
        RouterModule.forChild(ROUTES),<% } %>
        <%_ if(filters.uirouter) { _%>
        UIRouterModule.forChild({
            states: STATES,
        }),<% } %>
        <%_ if(filters.uibootstrap) { %>
        TooltipModule,<% } %>
    ],
    declarations: [
        MainComponent,
    ],
    <%_ if(filters.socketio) { -%>
    providers: [
        SocketService,
    ],<% } %>
    exports: [
        MainComponent,
    ],
})
class MainModule {}
