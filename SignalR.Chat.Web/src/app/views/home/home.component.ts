import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from '@microsoft/signalr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NameDialogComponent } from 'src/app/shared/name-dialog/name-dialog.component';

interface Message {
  userName: string,
  text: string,
  time: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  messages: Message[] = []
  messageControl = new FormControl('');
  userName!: string;

  connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7228/chat").build();

  constructor(
    public dialog: MatDialog, 
    public snackbar: MatSnackBar) {
    this.openDialog();
  }

  ngOnInit(): void {
    
  }

  openDialog() {
    const dialogRef = this.dialog.open(NameDialogComponent, {
      width: '250px',
      data: this.userName,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userName = result;
      this.startConnection();
      this.openSnackBar(result);
    });
  }

  openSnackBar(userName: string) {
    const message = userName == this.userName ? 'Você entrou na sala' : `${userName} acabou de entrar`;

    this.snackbar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  startConnection() {
    this.connection.on("newMessage", (userName: string, text: string, time: string) => {
      this.messages.push({
        text: text,
        userName: userName,
        time: time
      });
    });

    this.connection.on("newUser", (userName: string) => {
      console.log(userName)
      this.openSnackBar(userName);
    });

    this.connection.start().then(() => {
      this.connection.send("newUser", this.userName);
    });
  }

  sendMessage() {
    this.connection.send("newMessage", this.userName, this.messageControl.value)
      .then(() => {
        this.messageControl.setValue("");
      });
  }
}
