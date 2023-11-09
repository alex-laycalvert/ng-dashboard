import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import {
    DataService,
    type Report,
    type ReportInterval,
} from "./services/data.service";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: "./app.component.html",
    providers: [DataService],
})
export class AppComponent implements OnInit {
    interval: ReportInterval = "daily";
    chart: Chart | null = null;
    data: Report | undefined;

    constructor(private dataService: DataService) {}

    private fetchData() {
        this.dataService
            .getReport(new Date(2023, 0, 1), new Date(), this.interval)
            .subscribe((data) => {
                this.data = data;
                this.createChart();
            });
    }

    changeInterval(interval: ReportInterval) {
        this.interval = interval;
        this.fetchData();
    }

    ngOnInit() {
        this.fetchData();
    }

    createChart() {
        if (!this.chart) {
            this.chart = new Chart("reportChart", {
                type: "line",
                data: { datasets: [] },
            });
        }
        this.chart.data = {
            labels: (this.data?.graph ?? []).map((d) =>
                new Date(d.date).toLocaleDateString(),
            ),
            datasets: [
                {
                    label: "my label",
                    data: (this.data?.graph ?? []).map((d) => d.amount),
                    backgroundColor: "red",
                },
            ],
        };
        this.chart.update()
    }
}
