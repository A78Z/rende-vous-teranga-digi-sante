'use client';

import { QRCodeCanvas } from 'qrcode.react';

interface AppointmentQRCodeProps {
  data: {
    appointmentNumber: string;
    patientName: string;
    date: Date;
    time: string;
  };
  size?: number;
}

export const AppointmentQRCode = ({ data, size = 120 }: AppointmentQRCodeProps) => {
  const qrValue = JSON.stringify({
    ref: data.appointmentNumber,
    name: data.patientName,
    date: data.date.toLocaleDateString(),
    time: data.time,
  });

  return (
    <div className="bg-white p-2 rounded-xl inline-block shadow-sm border border-border">
      <QRCodeCanvas
        value={qrValue}
        size={size}
        level={"M"}
        includeMargin={false}
      />
    </div>
  );
};
