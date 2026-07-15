import type { QRTypeConfig, QRField } from '../types';

// Field definitions
const textField: QRField = {
  id: 'qrContent',
  label: 'Inhalt',
  type: 'textarea',
  placeholder: 'Geben Sie den Inhalt ein...',
};

const urlField: QRField = {
  id: 'qrContent',
  label: 'URL',
  type: 'url',
  placeholder: 'https://beispiel.de',
  required: true,
};

const emailFields: QRField[] = [
  { id: 'emailAddress', label: 'E-Mail Adresse', type: 'email', placeholder: 'name@beispiel.de', required: true },
  { id: 'emailSubject', label: 'Betreff', type: 'text', placeholder: 'Betreff (optional)' },
  { id: 'emailBody', label: 'Nachricht', type: 'textarea', placeholder: 'Nachricht (optional)' },
];

const phoneField: QRField = {
  id: 'qrContent',
  label: 'Telefonnummer',
  type: 'tel',
  placeholder: '+49 123 456789',
  required: true,
};

const smsFields: QRField[] = [
  { id: 'smsNumber', label: 'Telefonnummer', type: 'tel', placeholder: '+49 123 456789', required: true },
  { id: 'smsMessage', label: 'Nachricht', type: 'textarea', placeholder: 'Nachricht (optional)' },
];

const vcardFields: QRField[] = [
  { id: 'vcardFirstName', label: 'Vorname', type: 'text', placeholder: 'Vorname*', required: true },
  { id: 'vcardLastName', label: 'Nachname', type: 'text', placeholder: 'Nachname*', required: true },
  { id: 'vcardOrg', label: 'Organisation', type: 'text', placeholder: 'Firma' },
  { id: 'vcardTitle', label: 'Titel', type: 'text', placeholder: 'Position' },
  { id: 'vcardPhone', label: 'Telefon', type: 'tel', placeholder: '+49 123 456789' },
  { id: 'vcardMobile', label: 'Mobil', type: 'tel', placeholder: '+49 987 654321' },
  { id: 'vcardEmail', label: 'E-Mail', type: 'email', placeholder: 'name@beispiel.de' },
  { id: 'vcardWebsite', label: 'Website', type: 'url', placeholder: 'https://beispiel.de' },
  { id: 'vcardStreet', label: 'Straße', type: 'text', placeholder: 'Musterstraße 1' },
  { id: 'vcardCity', label: 'Stadt', type: 'text', placeholder: 'Berlin' },
  { id: 'vcardZip', label: 'PLZ', type: 'text', placeholder: '10115' },
  { id: 'vcardCountry', label: 'Land', type: 'text', placeholder: 'Deutschland' },
];

const wifiFields: QRField[] = [
  { id: 'wifiSSID', label: 'Netzwerkname (SSID)', type: 'text', placeholder: 'MeinWLAN', required: true },
  { id: 'wifiPassword', label: 'Passwort', type: 'text', placeholder: 'Passwort' },
  { id: 'wifiEncryption', label: 'Verschlüsselung', type: 'select', options: [
    { value: 'WPA', label: 'WPA/WPA2' },
    { value: 'WEP', label: 'WEP' },
    { value: 'nopass', label: 'Keine' },
  ]},
];

const whatsappFields: QRField[] = [
  { id: 'whatsappPhone', label: 'Telefonnummer', type: 'tel', placeholder: '+49 123 456789', required: true },
  { id: 'whatsappMessage', label: 'Nachricht', type: 'textarea', placeholder: 'Nachricht (optional)' },
];

const calendarFields: QRField[] = [
  { id: 'calendarTitle', label: 'Titel', type: 'text', placeholder: 'Event-Titel', required: true },
  { id: 'calendarLocation', label: 'Ort', type: 'text', placeholder: 'Veranstaltungsort' },
  { id: 'calendarStart', label: 'Start', type: 'text', placeholder: '2026-07-20T10:00' },
  { id: 'calendarEnd', label: 'Ende', type: 'text', placeholder: '2026-07-20T12:00' },
  { id: 'calendarDescription', label: 'Beschreibung', type: 'textarea', placeholder: 'Event-Beschreibung' },
];

const geoFields: QRField[] = [
  { id: 'geoLatitude', label: 'Breitengrad', type: 'text', placeholder: '52.52', required: true },
  { id: 'geoLongitude', label: 'Längengrad', type: 'text', placeholder: '13.405', required: true },
];

const cryptoFields: QRField[] = [
  { id: 'cryptoType', label: 'Kryptowährung', type: 'select', options: [
    { value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { value: 'bitcoincash', label: 'Bitcoin Cash (BCH)' },
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'litecoin', label: 'Litecoin (LTC)' },
  ]},
  { id: 'cryptoAddress', label: 'Adresse', type: 'text', placeholder: 'Wallet-Adresse', required: true },
  { id: 'cryptoAmount', label: 'Betrag', type: 'text', placeholder: '0.5' },
];

const socialFields: QRField[] = [
  { id: 'socialPlatform', label: 'Plattform', type: 'select', options: [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
  ]},
  { id: 'socialUrl', label: 'URL', type: 'url', placeholder: 'https://instagram.com/...', required: true },
];

// QR Type Configurations
export const QR_TYPES: Record<string, QRTypeConfig> = {
  text: { label: 'Text', icon: 'fas fa-keyboard', fields: [textField] },
  url: { label: 'URL', icon: 'fas fa-link', fields: [urlField] },
  email: { label: 'E-Mail', icon: 'fas fa-envelope', fields: emailFields },
  phone: { label: 'Telefon', icon: 'fas fa-phone', fields: [phoneField] },
  sms: { label: 'SMS', icon: 'fas fa-sms', fields: smsFields },
  vcard: { label: 'vCard', icon: 'fas fa-address-card', fields: vcardFields },
  wifi: { label: 'WiFi', icon: 'fas fa-wifi', fields: wifiFields },
  whatsapp: { label: 'WhatsApp', icon: 'fab fa-whatsapp', fields: whatsappFields },
  calendar: { label: 'Kalender', icon: 'fas fa-calendar', fields: calendarFields },
  geo: { label: 'Geo', icon: 'fas fa-map-marker-alt', fields: geoFields },
  crypto: { label: 'Krypto', icon: 'fab fa-bitcoin', fields: cryptoFields },
  social: { label: 'Social', icon: 'fas fa-share-nodes', fields: socialFields },
};

// Generate QR content string based on type and field values
export function generateQRContent(type: string, getFieldValue: (id: string) => string): string {
  switch (type) {
    case 'email': {
      const email = getFieldValue('emailAddress');
      const subject = getFieldValue('emailSubject');
      const body = getFieldValue('emailBody');
      return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    case 'sms': {
      const num = getFieldValue('smsNumber');
      const msg = getFieldValue('smsMessage');
      return `sms:${num}${msg ? '?body=' + encodeURIComponent(msg) : ''}`;
    }
    case 'phone':
      return `tel:${getFieldValue('qrContent')}`;
    case 'wifi': {
      const ssid = getFieldValue('wifiSSID');
      const pass = getFieldValue('wifiPassword');
      const enc = getFieldValue('wifiEncryption');
      return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    }
    case 'vcard': {
      const fn = getFieldValue('vcardFirstName');
      const ln = getFieldValue('vcardLastName');
      if (!fn && !ln) return '';
      let v = `BEGIN:VCARD\nVERSION:3.0\nN:${ln};${fn};;;\nFN:${fn} ${ln}\n`;
      const fields: [string, string][] = [
        ['vcardOrg', 'ORG'], ['vcardTitle', 'TITLE'],
        ['vcardPhone', 'TEL;TYPE=WORK'], ['vcardMobile', 'TEL;TYPE=CELL'],
        ['vcardEmail', 'EMAIL'], ['vcardWebsite', 'URL'],
      ];
      fields.forEach(([id, tag]) => {
        const val = getFieldValue(id);
        if (val) v += `${tag}:${val}\n`;
      });
      const street = getFieldValue('vcardStreet');
      const city = getFieldValue('vcardCity');
      const zip = getFieldValue('vcardZip');
      const country = getFieldValue('vcardCountry');
      if (street || city || zip || country) {
        v += `ADR;TYPE=WORK:;;${street};${city};;${zip};${country}\n`;
      }
      return v + 'END:VCARD';
    }
    case 'whatsapp': {
      const phone = getFieldValue('whatsappPhone').replace(/[^0-9]/g, '');
      const msg = getFieldValue('whatsappMessage');
      return `https://wa.me/${phone}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
    }
    case 'calendar': {
      const title = getFieldValue('calendarTitle');
      const location = getFieldValue('calendarLocation');
      const start = getFieldValue('calendarStart');
      const end = getFieldValue('calendarEnd');
      const desc = getFieldValue('calendarDescription');
      return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title}\nLOCATION:${location}\nDTSTART:${start.replace(/[-:]/g, '')}\nDTEND:${end.replace(/[-:]/g, '')}\nDESCRIPTION:${desc}\nEND:VEVENT\nEND:VCALENDAR`;
    }
    case 'geo': {
      const lat = getFieldValue('geoLatitude');
      const lon = getFieldValue('geoLongitude');
      return `geo:${lat},${lon}`;
    }
    case 'crypto': {
      const coin = getFieldValue('cryptoType');
      const addr = getFieldValue('cryptoAddress');
      const amount = getFieldValue('cryptoAmount');
      const prefixes: Record<string, string> = {
        bitcoin: 'bitcoin', bitcoincash: 'bitcoincash',
        ethereum: 'ethereum', litecoin: 'litecoin',
      };
      return `${prefixes[coin] || coin}:${addr}${amount ? `?amount=${amount}` : ''}`;
    }
    case 'social': {
      const platform = getFieldValue('socialPlatform');
      const url = getFieldValue('socialUrl');
      return url;
    }
    default:
      return getFieldValue('qrContent');
  }
}
