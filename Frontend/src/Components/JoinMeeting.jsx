import { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { joinMeeting, endMeeting } from "../api/meetingsapi";
import { toast } from "react-toastify";

export default function JoinMeeting() {
  const [error, setError] = useState(null);
  const { meetingId } = useParams();
  const authToken = useSelector((state) => state.auth.authToken);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { slug, role } = location.state || {};

  useEffect(() => {
    const initZego = async () => {
      try {
        if (!meetingId) throw new Error("No meeting ID provided");
        if (!authToken) throw new Error("Authentication required");

        const meetingData = await joinMeeting(meetingId, authToken);
        const isUserHost = meetingData.host_details.email === user.email;
        setIsHost(isUserHost);

        const redirectSlug = slug || meetingData.classroom; // Fallback to classroom ID if slug missing

        const roomID = meetingId;
        const userID = user.id || `user_${Math.floor(Math.random() * 10000)}`;
        const userName = user.username || `userName${userID}`;
        const appID = 2111459424; //appID
        const serverSecret = "c6c148f9436a7777d7dd4bd2e69ad844"; //serverSecret

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userID,
          userName
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        if (!zp) throw new Error("Failed to create ZegoUIKitPrebuilt instance");

        zp.joinRoom({
          container: document.getElementById("meetingContainer"),
          sharedLinks: [
            {
              name: "Meeting link",
              url: `${window.location.protocol}//${window.location.host}/join/${roomID}`,
            },
          ],
          scenario: {
            mode: isUserHost
              ? ZegoUIKitPrebuilt.GroupCall
              : ZegoUIKitPrebuilt.VideoConference,
          },
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 50,
          layout: "Auto",
          showLayoutButton: true,
          showRoomDetailsButton: isUserHost,
          showPreJoinView: false,
          showLeaveRoomConfirmDialog: true, // Prompt before leaving
          onLeaveRoom: () => {
            if (isUserHost) {
              navigate(`/meetings/${redirectSlug || ""}`); // Teacher leaves, meeting continues
              window.location.reload();
            } else {
              navigate(`/classroom/${redirectSlug || ""}`); // Student leaves
              window.location.reload();
            }
          },
        });
      } catch (err) {
        setError(
          `Failed to join the meeting: ${err.message || "Unknown error"}`
        );
        toast.error(err.message || "Failed to join meeting");
      }
    };

    initZego();

    return () => {};
  }, [meetingId, authToken, user, navigate, slug, role]);

  const [isHost, setIsHost] = useState(false);

  const handleEndMeeting = async () => {
    try {
      await endMeeting(meetingId, authToken);
      toast.success("Meeting ended successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to end meeting");
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-100 rounded">
          <p>{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 text-blue-500 hover:underline"
          >
            Return to Home
          </button>
        </div>
      )}
      <div
        id="meetingContainer"
        className="fixed top-0 left-0 w-full h-screen shadow-lg"
      ></div>{" "}
    </div>
  );
}
