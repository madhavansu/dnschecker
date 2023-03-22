import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DnsCheckerService, DnsStatus } from './dns-checker.service';

interface DnsTypes {
  type: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // ipPattern = "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$";
  // domainPattern = "^(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$";
  domainPattern = "^(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$";
  dnsStatuses: any;
  isSubmitted: boolean = false;

  display: any;
  center: google.maps.LatLngLiteral = {
      lat: 22.2736308,
      lng: 70.7512555
  };
  zoom = 1;
  apiLoaded: Observable<boolean>;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  
  dnsTypes: DnsTypes[] = [
    { type: 'A' },
    { type: 'CNAME' },
    { type: 'NS' },
    { type: 'PTR' },
    { type: 'MX' },
    { type: 'TXT' }
  ];

  dnsCheckerForm = this.fb.group({
    domain: ['', [Validators.required]],
    type: ['', Validators.required],
    expectedValue: [''],
    advanced: ['']
  })

  constructor(
    private readonly dnsCheckerService: DnsCheckerService,
    private readonly fb: FormBuilder) { 
       this.apiLoaded = dnsCheckerService.loadMapsApi();
  }

  ngOnInit() {
    
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.dnsCheckerForm.valid) {
      this.markerPositions = [];
      const domain = this.getFormValue('domain');
      const type = this.getFormValue('type');
      const expectedValue = this.getFormValue('expectedValue');
      const advanced = this.getFormValue('advanced');
      const params = '?domain='+domain+'&type='+type+'&expectedValue='+expectedValue+'&advanced='+advanced;
      this.dnsCheckerService.getDnsStatus(params).subscribe((response: DnsStatus[]) => {
        this.dnsStatuses = response;
        response.forEach(element => {
          this.markerPositions.push({lat: +element.latitude, lng: +element.longitude})
        });
      });
    }
  }

  getFormValue(control: string){
    return this.dnsCheckerForm.get(control)?.value;
  }

  // validateUrlIp(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  //     const domainPattern = /^(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

  //     const isDomainValid = ipPattern.test(control.value);
  //     return isDomainValid ? {invalidDomain: {value: 'Please enter a valid domain or IP'}} : null;
  //   };
  // }

  // Move the map
  moveMap(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  // Move positions
  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  // Used to add marker
  addMarker(event: google.maps.MapMouseEvent) {
    if(event.latLng) {
      this.markerPositions.push(event.latLng.toJSON());
    }  
  }
}
