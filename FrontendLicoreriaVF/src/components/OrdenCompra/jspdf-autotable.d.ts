// types/jspdf-autotable.d.ts
declare module 'jspdf-autotable' {
    import { jsPDF } from 'jspdf';

    interface AutoTableStyles {
        fillColor?: [number, number, number];
        textColor?: [number, number, number];
        fontSize?: number;
        lineColor?: [number, number, number];
        lineWidth?: number;
        halign?: 'left' | 'center' | 'right';
        valign?: 'top' | 'middle' | 'bottom';
        overflow?: 'linebreak' | 'ellipsize';
        cellPadding?: number;
    }

    interface AutoTableHeadStyles extends AutoTableStyles {
        fillColor?: [number, number, number];
        textColor?: [number, number, number];
    }

    interface AutoTableOptions {
        head: any[][];
        body: any[][];
        startY?: number;
        theme?: 'striped' | 'grid' | 'plain';
        headStyles?: AutoTableHeadStyles;
        styles?: AutoTableStyles;
        margin?: { top?: number; left?: number; bottom?: number; right?: number };
        pageBreak?: 'auto' | 'always' | 'never';
        showHead?: 'everyPage' | 'firstPage' | 'never';
        didDrawPage?: (data: { settings: AutoTableOptions; doc: jsPDF }) => void;
        didDrawCell?: (data: { row: number; column: number; cell: any; table: any; settings: AutoTableOptions; doc: jsPDF }) => void;
        willDrawCell?: (data: { row: number; column: number; cell: any; table: any; settings: AutoTableOptions; doc: jsPDF }) => void;
    }

    export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
