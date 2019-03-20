import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { CookieService } from 'ngx-cookie-service';
// import { RouterModule, Router } from '@angular/router';


@Injectable()
export class HomeService
{	
	private baseUrl = "http://10.99.226.170:5000"

	constructor ( private http: HttpClient){}
	
	Send_pk_to_hp(pk:any)
	{		
        return this.http.post(`${this.baseUrl}/addPk`,pk)       
	}

	Get_master_key(pk:any)
	{
		return this.http.put(`${this.baseUrl}/GetPatientMasterKey`,pk)
	}

	Get_all_chain(pk:any)
	{
		return this.http.put(`${this.baseUrl}/SendAllChainToPatient`,pk)
	}
	
}