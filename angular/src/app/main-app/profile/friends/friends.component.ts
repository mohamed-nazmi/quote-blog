import { Component, OnInit } from '@angular/core';

enum Display {
    Friends,
    SentFriendRequests,
    ReceivedFriendRequests
}

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
    display: Display;

    friends = [
        {
            fullname: 'Bill Mark',
            username: 'bill-mark',
            image: '../../../../assets/images/men/man3.jpg',
            description: 'A blogger, traveller, and sports enthusiastic!'
        },
        {
            fullname: 'Jack Thomson',
            username: 'jackktom',
            image: '../../../../assets/images/men/man2.jpg',
            description: 'Passionate footballer and theatre actor ;)'
        },
        {
            fullname: 'Wilder Hanks',
            username: 'wildhanks1',
            image: '../../../../assets/images/men/man4.jpg',
            description: 'Artist at noon, writer at night, lover all day!'
        },
        {
            fullname: 'George Ryan',
            username: 'george-ryann8',
            image: '../../../../assets/images/men/man6.jpg',
            description: 'Half American, half African'
        },
        {
            fullname: 'Ted Giggs',
            username: 'ted-alan-giggs',
            image: '../../../../assets/images/men/man5.jpg',
            description: 'Welcome bro to my world!'
        },
        {
            fullname: 'Sam Paulo',
            username: 'sampaulo4',
            image: '../../../../assets/images/men/man1.jpg',
            description: 'Full-stack developer'
        }
    ];

    ngOnInit() {
        this.display = Display.Friends;
    }

    get displayEnum() {
        return Display;
    }

    viewFriends() {
        this.display = Display.Friends;
    }

    viewSentRequests() {
        this.display = Display.SentFriendRequests;
    }

    viewReceivedRequests() {
        this.display = Display.ReceivedFriendRequests;
    }
}
