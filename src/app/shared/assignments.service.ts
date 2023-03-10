import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';

import { bdInitialAssignments } from './data';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  constructor(private loggingService:LoggingService,
              private http:HttpClient) {}

  assignments:Assignment[] = [];

  //URI = "http://localhost:8010/api/assignments";
  URI = "https://g1back2023mbdscasa.herokuapp.com/api/assignments";

  getAssignmentsAvecPagination(page:number, limit:number):Observable<any> {
    // On envoie une requete HTTP GET pour recuperer les assignments
    return this.http.get<Assignment[]>(this.URI + "?page=" + page + "&limit=" + limit);
  }

  // Un get assignment par id
  getAssignment(id:number):Observable<Assignment|undefined> {
    //const assignment = this.assignments.find((a) => a.id === id);
    // on envoie une requête HTTP GET pour récupérer l'assignment
    return this.http.get<Assignment>(this.URI + "/" + id);
  }

  addAssignment(a:Assignment):Observable<any> {
    a.id = Math.floor(Math.random()*100000000000000000);

    this.assignments.push(a);

    this.loggingService.log(a.nom, "ajouté");

    return this.http.post<Assignment>(this.URI, a);
  }

  updateAssignment(a:Assignment):Observable<any> {
    // On envoie une requete HTTP PUT pour modifier l'assignment

    this.loggingService.log(a.nom, "modifié");

    return this.http.put<Assignment>(this.URI, a);

    //return of("Assignment modifié");
  }

  deleteAssignment(a:Assignment):Observable<any> {
    // On envoie une requete HTTP DELETE pour supprimer l'assignment

    this.loggingService.log(a.nom, "supprimé");

    return this.http.delete(this.URI + "/" + a._id);
  }

  peuplerBD() {
    bdInitialAssignments.forEach((a) => {
      let newAssignment = new Assignment();
      newAssignment.nom = a.nom;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.rendu = a.rendu;


      this.addAssignment(newAssignment)
        .subscribe(reponse => {
          console.log(reponse);
        });
    });
  }

  peuplerBDavecForkJoin():Observable<any> {
    let appelsVersAddAssignment:Observable<any>[] = [];

    bdInitialAssignments.forEach((a) => {
      let newAssignment = new Assignment();
      newAssignment.nom = a.nom;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.rendu = a.rendu;


      appelsVersAddAssignment.push(this.addAssignment(newAssignment));
    });

    return forkJoin(appelsVersAddAssignment);
  }
}
