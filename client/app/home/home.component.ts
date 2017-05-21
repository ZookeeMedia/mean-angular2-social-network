import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import {  AlertService, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    friends: User[] = [];
    friend: any = {};
    model: any = {};
    loading = false;

    constructor(private router: Router, private userService: UserService, private alertService: AlertService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadFriendUsers(this.currentUser._id);
    }

    deleteUser(_id: string) {
        this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
    }

    followUser(_id: string) {
        (this.currentUser.hasOwnProperty("following")) ? true : this.currentUser.following = []; //make sure theres a following property
        (this.currentUser.following.indexOf(_id) == -1) ? this.currentUser.following.push(_id)  : false;

        this.userService.update(this.currentUser).subscribe(data => {
                    this.alertService.success('User Update successful', true);
                    this.loadAllUsers();
                    this.loadFriendUsers(this.currentUser._id);
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }

    unfollowUser(_id: string) {
        (this.currentUser.hasOwnProperty("following")) ? true : this.currentUser.following = []; //make sure theres a following property
        (this.currentUser.following.indexOf(_id) != -1) ? this.currentUser.following.splice(this.currentUser.following.indexOf(_id), 1)  : false; //delete the index

        this.userService.update(this.currentUser).subscribe(data => {
                    this.alertService.success('User Update successful', true);
                    this.loadAllUsers();
                    this.loadFriendUsers(this.currentUser._id);
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; console.log('this.users',this.users);});
    }

    private loadCurrentUser(_id: string) {
        this.userService.getById(_id).subscribe(friend => { this.friend = friend; console.log('this.friend',this.friend);});
    }

    private loadFriendUsers(_id: string) {
        this.userService.getFriendsById(_id).subscribe(friends => { this.friends = friends; console.log('this.friends',this.friends);});
    }
}