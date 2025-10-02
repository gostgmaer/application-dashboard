'use client';

import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/utils';
import { useMessaging } from '@/contexts/messaging-context';
import { CallSession } from '@/types';

interface CallNotificationProps {
  call: CallSession;
}

export default function CallNotification({ call }: CallNotificationProps) {
  const { answerCall, declineCall, endCall } = useMessaging();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (call.status === 'active' && call.startedAt) {
      interval = setInterval(() => {
        const duration = Math.floor((Date.now() - call.startedAt!.getTime()) / 1000);
        setCallDuration(duration);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [call.status, call.startedAt]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    answerCall(call.id);
  };

  const handleDecline = () => {
    declineCall(call.id);
  };

  const handleEnd = () => {
    endCall(call.id);
  };

  const getStatusColor = () => {
    switch (call.status) {
      case 'initiating':
      case 'ringing':
        return 'bg-blue-500';
      case 'active':
        return 'bg-green-500';
      case 'ended':
        return 'bg-gray-500';
      case 'declined':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (call.status) {
      case 'initiating':
        return 'Initiating call...';
      case 'ringing':
        return 'Ringing...';
      case 'active':
        return `Call active - ${formatDuration(callDuration)}`;
      case 'ended':
        return 'Call ended';
      case 'declined':
        return 'Call declined';
      default:
        return 'Unknown status';
    }
  };

  const isIncoming = call.initiatorId !== 'user1';
  const otherParticipant = call.participants.find(p => p.id !== 'user1');

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        {/* Call Status */}
        <div className="text-center mb-6">
          <div className={cn("w-3 h-3 rounded-full mx-auto mb-2", getStatusColor())} />
          <p className="text-sm text-muted-foreground">{getStatusText()}</p>
        </div>

        {/* Participant Info */}
        <div className="text-center mb-6">
          <Avatar className="h-20 w-20 mx-auto mb-4">
            <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
            <AvatarFallback className="text-lg">
              {otherParticipant?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-lg font-semibold mb-1">
            {isIncoming ? `${otherParticipant?.name} is calling` : `Calling ${otherParticipant?.name}`}
          </h3>
          
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {call.type === 'video' ? <Video className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
              {call.type === 'video' ? 'Video Call' : 'Audio Call'}
            </Badge>
            
            {call.teamsUrl && (
              <Badge variant="secondary">
                Teams
              </Badge>
            )}
          </div>
        </div>

        {/* Call Actions */}
        <div className="flex justify-center gap-4">
          {call.status === 'ringing' && isIncoming && (
            <>
              <Button
                onClick={handleDecline}
                variant="destructive"
                size="lg"
                className="rounded-full w-14 h-14 p-0"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={handleAnswer}
                variant="default"
                size="lg"
                className="rounded-full w-14 h-14 p-0 bg-green-600 hover:bg-green-700"
              >
                <Phone className="h-6 w-6" />
              </Button>
            </>
          )}

          {(call.status === 'active' || call.status === 'initiating') && (
            <>
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 p-0"
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>

              <Button
                onClick={handleEnd}
                variant="destructive"
                size="lg"
                className="rounded-full w-14 h-14 p-0"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>

              {call.teamsUrl && (
                <Button
                  onClick={() => window.open(call.teamsUrl, '_blank')}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-14 h-14 p-0"
                >
                  <Video className="h-6 w-6" />
                </Button>
              )}
            </>
          )}

          {call.status === 'ended' && (
            <Button
              onClick={() => {/* Close call notification */}}
              variant="outline"
              size="lg"
            >
              Close
            </Button>
          )}
        </div>

        {/* Teams Integration Notice */}
        {call.teamsUrl && call.status === 'active' && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Call is active in Microsoft Teams
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={() => window.open(call.teamsUrl, '_blank')}
              className="mt-1"
            >
              Open Teams
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}