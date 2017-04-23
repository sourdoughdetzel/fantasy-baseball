import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class AdminService {

    constructor(private localStorageService: LocalStorageService){
        this.curPwd = this.localStorageService.get(this.key) as string;
    }
    private key: string = "#!ffbAdmin!#";
    private adminPwd: string = "icanbetrusted";
    curPwd: string;

    get isAdmin(): boolean {
        return this.adminPwd === this.curPwd;
    }
    
    setLocalAdmin(pwd: string): void {
        this.curPwd = pwd;
        this.localStorageService.set(this.key, pwd);
    } 
}