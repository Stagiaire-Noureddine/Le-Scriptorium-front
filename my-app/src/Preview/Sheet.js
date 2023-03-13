import { Document, Page } from '@react-pdf/renderer';

const Sheet = ({pdfUrl, onDocumentLoadSuccess}) => (
    <Document file={pdfUrl}
            options={{ workerSrc: "/pdf.worker.js" }}
            onLoadSuccess={onDocumentLoadSuccess}
            loading>
        <Page pageNumber={1}
            noData="No page specified"
            onRenderError={(error) => alert('Error while loading page! ' + error.message)}
            orientation="portrait" />
    </Document>
);

export default Sheet;