import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Chart, registerables } from 'chart.js';
import { BrandReport, ProductTypeReport, ActiveProduct, Brand, Product } from '../../shared/report';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  brandReport: BrandReport[] = [];
  productTypeReport: ProductTypeReport[] = [];
  activeProducts: { brandName: string, productTypes: { productTypeName: string, products: Product[] }[] }[] = [];

  constructor(private apiService: ApiService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    console.log('Fetching report data...');
    this.apiService.getProductsReport().subscribe(
      data => {
        console.log('Report data received:', data);
        this.brandReport = data.brandReport || [];
        this.productTypeReport = data.productTypeReport || [];
        this.activeProducts = this.transformActiveProducts(data.activeProducts || []);

        console.log('Brand Report:', this.brandReport);
        console.log('Product Type Report:', this.productTypeReport);
        console.log('Active Products:', this.activeProducts);

        this.createBrandChart();
        this.createProductTypeChart();
      },
      error => {
        console.error('Error fetching report data', error);
      }
    );
  }

  transformActiveProducts(activeProducts: ActiveProduct[]): { brandName: string, productTypes: { productTypeName: string, products: Product[] }[] }[] {
    const transformed: { brandName: string, productTypes: { productTypeName: string, products: Product[] }[] }[] = [];

    activeProducts.forEach(productType => {
      productType.brands.forEach(brand => {
        let brandEntry = transformed.find(b => b.brandName === brand.brandName);
        if (!brandEntry) {
          brandEntry = { brandName: brand.brandName, productTypes: [] };
          transformed.push(brandEntry);
        }

        let productTypeEntry = brandEntry.productTypes.find(pt => pt.productTypeName === productType.productTypeName);
        if (!productTypeEntry) {
          productTypeEntry = { productTypeName: productType.productTypeName, products: [] };
          brandEntry.productTypes.push(productTypeEntry);
        }

        productTypeEntry.products.push(...brand.products);
      });
    });

    return transformed;
  }

  createBrandChart() {
    if (this.brandReport.length === 0) {
      console.warn('No brand data available');
      return;
    }
    console.log('Creating brand chart with data:', this.brandReport);
    const labels = this.brandReport.map(br => br.brandName);
    const data = this.brandReport.map(br => br.count);
    const ctx = document.getElementById('brandChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx.getContext('2d') as CanvasRenderingContext2D, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Products by Brand',
            data: data,
            backgroundColor: '#90E0EF'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
  createProductTypeChart() {
    if (this.productTypeReport.length === 0) {
      console.warn('No product type data available');
      return;
    }
    console.log('Creating product type chart with data:', this.productTypeReport);
    const labels = this.productTypeReport.map(pt => pt.productTypeName);
    const data = this.productTypeReport.map(pt => pt.count);
    const ctx = document.getElementById('productTypeChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx.getContext('2d') as CanvasRenderingContext2D, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Products by Product Type',
            data: data,
            backgroundColor: '#00B4D8'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
}
