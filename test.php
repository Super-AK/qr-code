import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Link, MessageSquare, User, Download, Copy, Check, Palette, Upload } from 'lucide-react';

const QRCodeGenerator = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [qrData, setQrData] = useState('');
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  });

  const [design, setDesign] = useState({
    size: 300,
    foreground: '#000000',
    background: '#ffffff',
    errorCorrection: 'H',
    margin: 20,
    style: 'squares',
    borderWidth: 0,
    borderColor: '#000000',
    borderRadius: 0,
    logo: null,
    logoSize: 20,
    label: '',
    labelPosition: 'bottom',
    labelColor: '#000000',
    labelBgColor: '#ffffff'
  });

  const [logoPreview, setLogoPreview] = useState(null);

  const predefinedIcons = [
    { name: 'Instagram', icon: 'instagram', color: '#E4405F' },
    { name: 'PayPal', icon: 'paypal', color: '#00457C' },
    { name: 'E-Mail', icon: 'mail', color: '#EA4335' },
    { name: 'Telefon', icon: 'phone', color: '#34A853' },
    { name: 'WLAN', icon: 'wifi', color: '#4285F4' },
    { name: 'Standort', icon: 'mappin', color: '#FBBC04' },
    { name: 'Shop', icon: 'cart', color: '#FF6B35' }
  ];

  const generateIconDataUrl = (iconName, color) => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100, 100);
    
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    
    switch(iconName) {
      case 'instagram':
        ctx.beginPath();
        ctx.rect(20, 25, 60, 50);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(50, 50, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillRect(65, 30, 8, 8);
        break;
      case 'paypal':
        ctx.font = 'bold 70px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('P', 50, 50);
        break;
      case 'mail':
        ctx.beginPath();
        ctx.rect(15, 30, 70, 40);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(15, 30);
        ctx.lineTo(50, 55);
        ctx.lineTo(85, 30);
        ctx.stroke();
        break;
      case 'phone':
        ctx.beginPath();
        ctx.rect(30, 15, 40, 70);
        ctx.stroke();
        ctx.fillRect(45, 75, 10, 3);
        break;
      case 'wifi':
        for(let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(50, 70, 15 + i * 15, Math.PI * 1.2, Math.PI * 1.8);
          ctx.stroke();
        }
        ctx.fillRect(47, 68, 6, 6);
        break;
      case 'mappin':
        ctx.beginPath();
        ctx.moveTo(50, 80);
        ctx.lineTo(35, 40);
        ctx.arc(50, 35, 15, Math.PI, 0);
        ctx.lineTo(65, 40);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(50, 35, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        break;
      case 'cart':
        ctx.beginPath();
        ctx.moveTo(20, 30);
        ctx.lineTo(30, 30);
        ctx.lineTo(40, 60);
        ctx.lineTo(75, 60);
        ctx.stroke();
        ctx.fillRect(37, 70, 8, 8);
        ctx.fillRect(67, 70, 8, 8);
        break;
      default:
        break;
    }
    
    return canvas.toDataURL();
  };

  const handleIconSelect = (iconName, color) => {
    const iconUrl = generateIconDataUrl(iconName, color);
    setLogoPreview(iconUrl);
    setDesign({...design, logo: iconUrl});
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 200;
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          const resizedUrl = canvas.toDataURL('image/png');
          setLogoPreview(resizedUrl);
          setDesign({...design, logo: resizedUrl});
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = async (text) => {
    if (!text.trim()) {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = '';
      }
      return;
    }

    try {
      if (!window.QRious) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
        script.onload = () => {
          createQR(text);
        };
        document.head.appendChild(script);
      } else {
        createQR(text);
      }
    } catch (error) {
      console.error('Error loading QR library:', error);
    }
  };

  const createQR = (text) => {
    if (!qrContainerRef.current) return;
    
    try {
      qrContainerRef.current.innerHTML = '';
      
      const wrapper = document.createElement('div');
      wrapper.className = 'inline-block';
      wrapper.style.backgroundColor = design.background;
      wrapper.style.padding = design.margin + 'px';
      wrapper.style.borderRadius = design.borderRadius + 'px';
      if (design.borderWidth > 0) {
        wrapper.style.border = `${design.borderWidth}px solid ${design.borderColor}`;
      }
      
      const canvas = document.createElement('canvas');
      
      const qr = new window.QRious({
        element: canvas,
        value: text,
        size: design.size,
        background: design.background,
        foreground: design.foreground,
        level: design.errorCorrection,
        padding: 0
      });
      
      if (design.style === 'dots') {
        applyDotStyle(canvas);
      }
      
      if (design.logo) {
        addLogoToCanvas(canvas);
      }
      
      wrapper.appendChild(canvas);
      
      if (design.label.trim()) {
        const labelDiv = document.createElement('div');
        labelDiv.textContent = design.label;
        labelDiv.style.cssText = `
          text-align: center;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 14px;
          color: ${design.labelColor};
          background-color: ${design.labelBgColor};
          border-radius: ${design.borderRadius}px;
          margin-top: ${design.labelPosition === 'bottom' ? '8px' : '0'};
          margin-bottom: ${design.labelPosition === 'top' ? '8px' : '0'};
        `;
        
        if (design.labelPosition === 'top') {
          wrapper.insertBefore(labelDiv, canvas);
        } else {
          wrapper.appendChild(labelDiv);
        }
      }
      
      qrContainerRef.current.appendChild(wrapper);
      
    } catch (error) {
      console.error('Error creating QR code:', error);
    }
  };

  const addLogoToCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const logoSize = (design.size * design.logoSize) / 100;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;
      
      const padding = logoSize * 0.1;
      ctx.fillStyle = 'white';
      ctx.fillRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2);
      
      ctx.drawImage(img, x, y, logoSize, logoSize);
    };
    
    img.src = design.logo;
  };

  const applyDotStyle = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.fillStyle = design.background;
    tempCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    tempCtx.fillStyle = design.foreground;
    const moduleSize = 10;
    
    for (let y = 0; y < canvas.height; y += moduleSize) {
      for (let x = 0; x < canvas.width; x += moduleSize) {
        const index = (y * canvas.width + x) * 4;
        if (data[index] < 128) {
          tempCtx.beginPath();
          tempCtx.arc(x + moduleSize/2, y + moduleSize/2, moduleSize/2.5, 0, Math.PI * 2);
          tempCtx.fill();
        }
      }
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
  };

  const formatUrl = (url) => {
    if (!url.trim()) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  const generateVCard = (contact) => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;
  };

  useEffect(() => {
    let data = '';
    
    switch (activeTab) {
      case 'url':
        data = formatUrl(urlInput);
        break;
      case 'text':
        data = textInput;
        break;
      case 'contact':
        if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
          data = generateVCard(contactInfo);
        }
        break;
      default:
        data = '';
    }
    
    setQrData(data);
    generateQRCode(data);
  }, [activeTab, urlInput, textInput, contactInfo, design]);

  const downloadQRCode = () => {
    if (!qrData) return;
    
    const wrapper = qrContainerRef.current?.querySelector('div');
    if (!wrapper) return;
    
    const tempCanvas = document.createElement('canvas');
    const wrapperWidth = wrapper.offsetWidth;
    const wrapperHeight = wrapper.offsetHeight;
    
    tempCanvas.width = wrapperWidth * 2;
    tempCanvas.height = wrapperHeight * 2;
    const ctx = tempCanvas.getContext('2d');
    ctx.scale(2, 2);
    
    ctx.fillStyle = design.background;
    ctx.fillRect(0, 0, wrapperWidth, wrapperHeight);
    
    if (design.borderWidth > 0) {
      ctx.strokeStyle = design.borderColor;
      ctx.lineWidth = design.borderWidth;
      const offset = design.borderWidth / 2;
      ctx.strokeRect(offset, offset, wrapperWidth - design.borderWidth, wrapperHeight - design.borderWidth);
    }
    
    const qrCanvas = wrapper.querySelector('canvas');
    if (qrCanvas) {
      let yPos = design.margin;
      
      if (design.label.trim() && design.labelPosition === 'top') {
        ctx.fillStyle = design.labelBgColor;
        ctx.fillRect(design.margin, yPos, wrapperWidth - design.margin * 2, 30);
        ctx.fillStyle = design.labelColor;
        ctx.font = '600 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(design.label, wrapperWidth / 2, yPos + 20);
        yPos += 38;
      }
      
      ctx.drawImage(qrCanvas, design.margin, yPos);
      
      if (design.label.trim() && design.labelPosition === 'bottom') {
        yPos += design.size + 8;
        ctx.fillStyle = design.labelBgColor;
        ctx.fillRect(design.margin, yPos, wrapperWidth - design.margin * 2, 30);
        ctx.fillStyle = design.labelColor;
        ctx.font = '600 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(design.label, wrapperWidth / 2, yPos + 20);
      }
    }
    
    const link = document.createElement('a');
    link.download = `qr-code-${activeTab}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  const copyToClipboard = async () => {
    if (qrData) {
      try {
        await navigator.clipboard.writeText(qrData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const resetForm = () => {
    setUrlInput('');
    setTextInput('');
    setContactInfo({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      organization: '',
      url: ''
    });
    setQrData('');
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
    }
  };

  const tabs = [
    { id: 'url', label: 'URL', icon: Link },
    { id: 'text', label: 'Text', icon: MessageSquare },
    { id: 'contact', label: 'Kontakt', icon: User },
    { id: 'design', label: 'Design', icon: Palette }
  ];

  const colorPresets = [
    { name: 'Klassisch', fg: '#000000', bg: '#ffffff' },
    { name: 'Blau', fg: '#1e40af', bg: '#dbeafe' },
    { name: 'Grün', fg: '#15803d', bg: '#dcfce7' },
    { name: 'Lila', fg: '#7e22ce', bg: '#f3e8ff' },
    { name: 'Rot', fg: '#b91c1c', bg: '#fee2e2' },
    { name: 'Orange', fg: '#c2410c', bg: '#ffedd5' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            QR-Code Generator
          </h1>
          <p className="text-gray-600 text-lg">Erstelle individuelle QR-Codes mit Logo und Beschriftung</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6 overflow-y-auto max-h-[700px] pr-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {activeTab === 'url' && 'URL eingeben'}
                  {activeTab === 'text' && 'Text eingeben'}
                  {activeTab === 'contact' && 'Kontaktinformationen'}
                  {activeTab === 'design' && 'Design anpassen'}
                </h2>

                {activeTab === 'url' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website-URL
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="beispiel.de"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}

                {activeTab === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text-Inhalt
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Gib Text ein..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vorname</label>
                        <input
                          type="text"
                          value={contactInfo.firstName}
                          onChange={(e) => setContactInfo({...contactInfo, firstName: e.target.value})}
                          placeholder="Max"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nachname</label>
                        <input
                          type="text"
                          value={contactInfo.lastName}
                          onChange={(e) => setContactInfo({...contactInfo, lastName: e.target.value})}
                          placeholder="Mustermann"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefonnummer</label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        placeholder="+49 123 456789"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        placeholder="max@beispiel.de"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organisation</label>
                      <input
                        type="text"
                        value={contactInfo.organization}
                        onChange={(e) => setContactInfo({...contactInfo, organization: e.target.value})}
                        placeholder="Firma"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={contactInfo.url}
                        onChange={(e) => setContactInfo({...contactInfo, url: e.target.value})}
                        placeholder="https://beispiel.de"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'design' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Farbvorlagen</label>
                      <div className="grid grid-cols-3 gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setDesign({...design, foreground: preset.fg, background: preset.bg})}
                            className="px-4 py-3 rounded-lg border-2 hover:border-purple-500 transition-all"
                            style={{
                              backgroundColor: preset.bg,
                              color: preset.fg,
                              borderColor: design.foreground === preset.fg && design.background === preset.bg ? '#9333ea' : '#e5e7eb'
                            }}
                          >
                            <div className="text-xs font-medium">{preset.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vordergrund</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={design.foreground}
                            onChange={(e) => setDesign({...design, foreground: e.target.value})}
                            className="h-12 w-16 rounded-lg border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={design.foreground}
                            onChange={(e) => setDesign({...design, foreground: e.target.value})}
                            className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hintergrund</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={design.background}
                            onChange={(e) => setDesign({...design, background: e.target.value})}
                            className="h-12 w-16 rounded-lg border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={design.background}
                            onChange={(e) => setDesign({...design, background: e.target.value})}
                            className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">QR-Code Stil</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setDesign({...design, style: 'squares'})}
                          className={`px-6 py-4 rounded-xl border-2 transition-all ${
                            design.style === 'squares'
                              ? 'border-purple-600 bg-purple-50 text-purple-700'
                              : 'border-gray-300 bg-white text-gray-700'
                          }`}
                        >
                          <div className="font-medium">Quadrate</div>
                        </button>
                        
                        <button
                          onClick={() => setDesign({...design, style: 'dots'})}
                          className={`px-6 py-4 rounded-xl border-2 transition-all ${
                            design.style === 'dots'
                              ? 'border-purple-600 bg-purple-50 text-purple-700'
                              : 'border-gray-300 bg-white text-gray-700'
                          }`}
                        >
                          <div className="font-medium">Punkte</div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Größe: {design.size}px
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="500"
                        step="50"
                        value={design.size}
                        onChange={(e) => setDesign({...design, size: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rand: {design.margin}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={design.margin}
                        onChange={(e) => setDesign({...design, margin: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-purple-600"
                      />
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Rahmen</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rahmenbreite: {design.borderWidth}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={design.borderWidth}
                          onChange={(e) => setDesign({...design, borderWidth: parseInt(e.target.value)})}
                          className="w-full h-2 bg-gray-200