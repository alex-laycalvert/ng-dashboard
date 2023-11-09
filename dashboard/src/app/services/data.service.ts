import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

export type ReportInterval = "daily" | "monthly" | "yearly";
export type Report = {
    graph: { amount: number; date: number }[];
    total: number;
};

@Injectable()
export class DataService {
    apiUrl = "http://localhost:5002/api";

    constructor(private http: HttpClient) {}

    getReport(start: Date, end: Date, interval: ReportInterval = "daily") {
        return this.http.get<Report>(this.apiUrl + "/report", {
            params: new HttpParams({
                fromObject: {
                    start: start.getTime(),
                    end: end.getTime(),
                    interval,
                },
            }),
        });
    }
}
