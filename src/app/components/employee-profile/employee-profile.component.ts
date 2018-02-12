import {Component, OnInit} from "@angular/core";
import {EmployeeProfileService} from "../../services/employee-profile.service";
import {ContactsService} from "../../services/contacts.service";
import {Employee} from "../../models/employee";
import {Contacts} from "../../models/contacts";
import {ParametersService} from "../../services/parameters.service";
import {ParametersDetail} from "../../models/parametersDetail";
import {ActivatedRoute} from "@angular/router";
import {Employy_foto_listService} from "../../services/employy_foto_list.service";
import {Employee_foto} from "../../models/employee_foto";
import {PortfolioService} from "../../services/portfolio.service";
import {Portfolio} from "../../models/portfolio";
import {host} from "../../config";
import {Gender} from "../../models/gender";

import {Appearancetype} from "../../models/appearancetype";
import {City} from "../../models/city";
import {Eyecolor} from "../../models/eyecolor";
import {Employmenttype} from "../../models/employmenttype";
import {Haircolor} from "../../models/haircolor";
import {Country} from "../../models/country";
import {Updateemployee} from "../../models/updateemployee";
import {HttpService} from "../../http.service";
import {EmployeeComponent} from "../../employee/employee.component";

@Component({
    selector:'employee-profile-app',
    templateUrl: './employee-profile.component.html',
    styleUrls: ['./employee-profile.component.css'],
    providers:[EmployeeProfileService,ContactsService,ParametersService,Employy_foto_listService,PortfolioService]
})

export class EmployeeProfileComponent implements  OnInit {
    host = host;
    code_confirm_email = '';
    confirm_email: string;
    check_confirm_email: boolean;
    user_id: string = localStorage.getItem('user_id');
    profile: Employee = new Employee;
    param: string;
    parameters: ParametersDetail = new ParametersDetail;
    cont: string;
    photos: Employee_foto[]=[];
    contacts: Contacts = new Contacts;
    portfolios: Portfolio[]=[];
    countrys: Country[] = [];
    haircolors: Haircolor[] = [];
    employmenttypes: Employmenttype[] = [];
    genders: Gender[] = [];
    eyecolors: Eyecolor[] = [];
    citys: City[] = [];
    appearancetypes: Appearancetype[] = [];
    parametersUpdate: Updateemployee = new Updateemployee();
    tatu: boolean;
    piersing: boolean;
    received: number;
    employmenttype_elem: number;
    type_gender: boolean;
    check: boolean = true;
    update:boolean = false;
    portfolio_form:boolean = true;
    new_portfolio_data: Portfolio = new Portfolio;
    CurrentFile: File;
    imageSource: string;
    formData: FormData = new FormData();
    CurrentFilePhoto: File;
    imageSourcePhoto: string;
    formDataPhoto: FormData = new FormData();
    path_photo: boolean = true;

    updateprofile(){
        this.update = !this.update;
    }

    constructor(private employeeProfileService: EmployeeProfileService,
                private contactsService: ContactsService,
                private parametersService: ParametersService,
                private httpService: ParametersService,
                // private activateRoute: ActivatedRoute,
                private fotoService: Employy_foto_listService,
                private portfolioService: PortfolioService,
                private activateRoute: ActivatedRoute,
                private commonService: HttpService,
                private employeeComponent: EmployeeComponent
                ) {
        // this.user_id = this.activateRoute.snapshot.params['id'];
        this.update = activateRoute.snapshot.queryParams['edit'];
    }

    ngOnInit() {
        this.confirm_email = localStorage.getItem('email_confirm');
        if (this.confirm_email == 'True') {
          this.check_confirm_email = true;
        } else {
          this.check_confirm_email = false;
        }
        this.employeeProfileService.getEmployee(this.host + 'employee/' + this.user_id + '/').subscribe((data: Employee) => {
            this.profile = data;
                this.param = this.profile.param_list;
                this.parametersService.getParameters(this.param).subscribe((dataparam: ParametersDetail) => {
                  this.parameters = dataparam;
                  console.log('param', this.parameters);
                  if (this.parameters.gender['id_c'] == 32){
                    this.type_gender = true;
                  }
                  else{
                    this.type_gender = false;
                  }
                    this.cont = this.profile.contacts;
                    this.contactsService.getContacts(this.cont).subscribe((datacontact: Contacts) => {
                      this.contacts = datacontact;
                      this.fill_data_update();
                      console.log('pad', this.parametersUpdate.first_name);
                    });
                });
        });
        this.fotoService.getFotos(this.host+'employee_photo/?employee_id='+this.user_id).subscribe(datafoto => this.photos = datafoto);
        this.portfolioService.getPortfolios(host+'portfolioelem/?employee_id='+this.user_id).subscribe(portfoliodata => this.portfolios = portfoliodata);
        this.httpService.getCountry(host+'country/').subscribe(data => this.countrys=data);
        this.httpService.getHaircolor(host+'haircolor/').subscribe(data => this.haircolors=data);
        this.httpService.getGender(host+'gender/').subscribe(data => this.genders=data);
        this.httpService.getEyecolor(host+'eyecolor/').subscribe(data => this.eyecolors=data);
        this.httpService.getCity(host+'city/').subscribe(data => this.citys=data);
        this.httpService.getAppearancetype(host+'appearancetype/').subscribe(data => this.appearancetypes=data);
        this.httpService.getEmploymenttype(host+'employmenttype/').subscribe(data => this.employmenttypes=data);
        this.tatu = false;
        this.piersing = false;
    }
    submit(parametersUpdate: Updateemployee, type_gender:boolean){
        if (type_gender){
          parametersUpdate.gender = 32;
        }
        else{
          parametersUpdate.gender = 33;
        }
        this.httpService.putParameteremployee(parametersUpdate, this.host+'update_employee/'+this.user_id+'/')
            .subscribe(
                data => {this.received = data["employee_id"];
                    this.update = !this.update;
                    this.ngOnInit();
                    this.employeeComponent.getEmployee();
                },
            );
    }

    fill_data_update() {
      this.parametersUpdate.first_name = this.profile.first_name;
      this.parametersUpdate.last_name = this.profile.last_name;
      this.parametersUpdate.description = this.profile.description;
      this.parametersUpdate.birthday = this.parameters.birthday;
      this.parametersUpdate.age = this.parameters.age;
      this.parametersUpdate.growth = this.parameters.growth;
      this.parametersUpdate.gender = this.parameters.gender['id_c'];
      this.parametersUpdate.city = this.parameters.city['id'];
      this.parametersUpdate.clothsize = this.parameters.clothsize;
      this.parametersUpdate.chestsize = this.parameters.chestsize;
      this.parametersUpdate.waistsize = this.parameters.waistsize;
      this.parametersUpdate.thighsize = this.parameters.thighsize;
      this.parametersUpdate.footsize = this.parameters.footsize;
      this.parametersUpdate.necksize = this.parameters.necksize;
      this.parametersUpdate.headsize = this.parameters.headsize;
      this.parametersUpdate.employmenttype = this.parameters.employmenttype[0]['id'];
      this.parametersUpdate.appearancetype = this.parameters.appearancetype['id'];
      this.parametersUpdate.haircolor = this.parameters.haircolor['id'];
      this.parametersUpdate.eyecolor = this.parameters.eyecolor['id'];
      this.parametersUpdate.tatu = this.parameters.tatu;
      this.parametersUpdate.piercing = this.parameters.piercing;
      this.parametersUpdate.phone_number = this.contacts.phone_number;
      this.parametersUpdate.email = this.contacts.email;
    }

    open_form_portfolio(){
      this.portfolio_form = !this.portfolio_form;
    }
    submit_portfolio(portfolio_data: Portfolio){
      this.portfolioService.postPortfolio(portfolio_data, this.user_id, host+'new_portfolio/').subscribe(
        data => {
          this.ngOnInit();
          this.open_form_portfolio();
        }
      );
    }
    public FileChangeEvent(fileInput: any){
      this.CurrentFile = fileInput.target.files[0];
      this.formData.append( 'name', this.CurrentFile.name);

      let reader = new FileReader();
      reader.onload = () => {
        this.imageSource = reader.result;
        this.formData.append('image', this.CurrentFile);
        this.employeeProfileService.putImgEmployee(this.formData, host+'new_img_employee/' + this.user_id + '/')
          .subscribe(
            data => {
              // this.castDetail.image = data['image_url'];
              this.ngOnInit();
              this.employeeComponent.getEmployee();
            },
            error => console.log(error)
          );
      };
      reader.readAsDataURL(this.CurrentFile);
    }
    public AddPhotoEvent(fileInput: any){
      this.CurrentFilePhoto = fileInput.target.files[0];
      this.formDataPhoto.append( 'name', this.CurrentFilePhoto.name);

      let reader = new FileReader();
      reader.onload = () => {
        this.imageSourcePhoto = reader.result;
        this.formDataPhoto.append('image', this.CurrentFilePhoto);
        this.employeeProfileService.putPhotoEmployee(this.formDataPhoto, this.host+'add_photo_employee/' + this.user_id + '/')
          .subscribe(
            data => {
              // this.castDetail.image = data['image_url'];
              this.ngOnInit();
            },
            error => console.log(error)
          );
      };
      reader.readAsDataURL(this.CurrentFilePhoto);
    }
    send_confirm_code(code_confirm: string){
      this.commonService.postConfirmEmail(code_confirm, this.user_id, this.host + 'confirm_email/').subscribe(
        data => {
          localStorage.setItem('email_confirm', 'True');
          this.ngOnInit();
        },
        error => {
          this.code_confirm_email = 'Неверный код';
        }
      );
    }
    open_Photo() {
      this.path_photo = !this.path_photo;
    }
}
