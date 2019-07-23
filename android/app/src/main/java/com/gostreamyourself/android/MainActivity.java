package com.gostreamyourself.android;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.SurfaceHolder;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import com.pedro.encoder.input.video.CameraOpenException;

import com.pedro.rtplibrary.rtsp.RtspCamera2;
import com.pedro.rtplibrary.view.OpenGlView;
import com.pedro.rtsp.utils.ConnectCheckerRtsp;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URISyntaxException;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.ArrayList;
import java.util.List;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import butterknife.BindView;
import butterknife.ButterKnife;

public class MainActivity extends AppCompatActivity implements ConnectCheckerRtsp, View.OnClickListener, SurfaceHolder.Callback {
    @BindView(R.id.main_surfaceView) OpenGlView surfaceView;
    @BindView(R.id.main_recycler) RecyclerView messagesView;
    @BindView(R.id.main_startSwitch) Switch startSwitch;
    @BindView(R.id.main_cameraSwitch) Switch cameraSwitch;
    @BindView(R.id.main_viewerCount) TextView viewerCountTextView;
    @BindView(R.id.main_sendButton) ImageButton sendButton;
    @BindView(R.id.main_messageInput) EditText messageEditText;

    private static final String TAG = MainActivity.class.getSimpleName();
    private Socket socket;
    private Boolean isConnected = true;
    private String username;
    private boolean typing = false;
    private Handler typingHandler = new Handler();
    private List<Message> messages = new ArrayList<Message>();
    private RecyclerView.Adapter messageAdapter;
    private String URL;
    private RtspCamera2 rtspCamera2;
    private String cerftificateName;

    private String userMsg;

    private String streamID;
    private String chatID;

    private PrivateKey privateKey;

    private static final int TYPING_TIMER_LENGTH = 600;
    private static final int CAMERA_REQUEST_CODE = 1888;
    private static final int REQUEST_LOGIN = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
        messageAdapter = new MessageAdapter(getApplicationContext(), messages);

        String streamId = getIntent().getStringExtra("streamID");

        Log.i(TAG, "onCreate: " + getIntent().getStringExtra("chatID"));

        chatID = getIntent().getStringExtra("chatID");
        String signedChatId = "";


        try {
            privateKey = loadPrivateKey(getIntent().getStringExtra("privateKey"));
            username = getIntent().getStringExtra("userName").toString();
            cerftificateName = getIntent().getStringExtra("certificateName");

            cerftificateName = cerftificateName.toLowerCase().replace("certificate", "").replace(".key", ".crt");


            Log.i(TAG, "onCreate: CERTIFICATE" + cerftificateName);

            cerftificateName = cerftificateName.replace("Key", "Certificate");
            Log.i(TAG, "onCreate: CERTIFICATE2" + cerftificateName);

            byte[] data = chatID.getBytes();

            Signature instance = Signature.getInstance("SHA256withRSA");
            instance.initSign(privateKey);
            instance.update(data);
            byte[] signatureBytes = instance.sign();

            StringBuilder sb = new StringBuilder();
            for (int i=0; i<signatureBytes.length; i++) {
                sb.append(String.format("%02X ",signatureBytes[i]));
            }

            signedChatId = sb.toString();
            signedChatId =  signedChatId.replace(" ", "");

            signedChatId = signedChatId.toLowerCase();
        } catch (Exception e){
            e.printStackTrace();
        }

        //User name
        //Certificate
        //Stream signed
        //Stream unsigner


        try {

            String url = "http://back3ndb0is.herokuapp.com/chat/socket?";

            IO.Options mOptions = new IO.Options();
            mOptions.query = "stream=" + chatID + "&signature=" + signedChatId + "&userkey=" + cerftificateName + "&username=" + username;


            Log.i(TAG, "onCreate: " + mOptions.toString());

                socket = IO.socket(url, mOptions);
            } catch (URISyntaxException e) {
                throw new RuntimeException(e);
            }

            connectSocket();



        //surfaceView.setKeepAspectRatio(true);


        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, CAMERA_REQUEST_CODE);

        URL = "rtsp://145.49.53.161:80/live/" + streamId;

        rtspCamera2 = new RtspCamera2(surfaceView, this);
        Log.i(TAG, "onCreate: BITRATE" + rtspCamera2.getBitrate());
        surfaceView.getHolder().addCallback(this);

        messageEditText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int id, KeyEvent event) {
                if (id == R.id.send || id == EditorInfo.IME_NULL) {
                    attemptSend();
                    return true;
                }

                return false;
            }
        });

        messageEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (null == username) {
                    return;
                }

                if (!socket.connected()) {
                    return;
                }

//                if (!typing) {
//                    typing = true;
//                    socket.emit("typing");
//                }

                //typingHandler.removeCallbacks(onTypingTimeout);
                //typingHandler.postDelayed(onTypingTimeout, TYPING_TIMER_LENGTH);
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                attemptSend();
            }
        });

        startSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    Toast.makeText(MainActivity.this, "Turned stream on", Toast.LENGTH_SHORT).show();
                    if (!rtspCamera2.isStreaming()) {
                        if (rtspCamera2.isRecording() || rtspCamera2.prepareAudio()) {
                            rtspCamera2.prepareVideo(480, 320, 30, 1228800, false, 90);

                            Log.i("test", "onCheckedChanged: STARTING STREAM");
                            rtspCamera2.startStream(URL);
                        } else {
                            Toast.makeText(MainActivity.this, "Error preparing stream, This device cant do it", Toast.LENGTH_SHORT).show();
                        }
                    }
                } else {
                    Toast.makeText(MainActivity.this, "Turned stream off", Toast.LENGTH_SHORT).show();
                    rtspCamera2.stopStream();
                }
            }
        });

        cameraSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                try {
                    rtspCamera2.switchCamera();
                } catch (CameraOpenException e) {
                    Toast.makeText(MainActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });

        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptSend();
            }
        });

        MessageAdapter adapter = new MessageAdapter(this, messages);
        messagesView.setAdapter(adapter);
        LinearLayoutManager layoutManager = new LinearLayoutManager(MainActivity.this);
        layoutManager.setStackFromEnd(true);
        messagesView.setLayoutManager(layoutManager);
    }

    @Override
    public void onConnectionSuccessRtsp() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this, "Connection success", Toast.LENGTH_SHORT).show();
            }
        });
    }


    @Override
    public void onConnectionFailedRtsp(final String reason) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this, "Connection failed. " + reason, Toast.LENGTH_LONG).show();
                rtspCamera2.stopStream();
            }
        });
    }

    @Override
    public void onDisconnectRtsp() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this, "Disconnected", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onAuthErrorRtsp() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this, "Auth error", Toast.LENGTH_SHORT).show();
                rtspCamera2.stopStream();
            }
        });
    }

    @Override
    public void onAuthSuccessRtsp() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(MainActivity.this, "Auth success", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void surfaceCreated(SurfaceHolder surfaceHolder) {

    }

    @Override
    public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int i1, int i2) {
        rtspCamera2.startPreview();
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder surfaceHolder) {
        rtspCamera2.stopPreview();
    }

    @Override
    public void onClick(View view) {

    }

    private void connectSocket() {
        socket.on(Socket.EVENT_CONNECT, onConnect);
        socket.on(Socket.EVENT_DISCONNECT, onDisconnect);
        socket.on(Socket.EVENT_CONNECT_ERROR, onConnectError);
        socket.on(Socket.EVENT_CONNECT_TIMEOUT, onConnectError);
        socket.on("MESSAGE", onNewMessage);
        socket.on("VIEWERS", onViewersChange);
        //socket.on("typing", onTyping);
        //1socket.on("stop typing", onStopTyping);
        socket.connect();
    }

    private Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if(!isConnected) {
                        Log.i(TAG, "run: Connected");
                        Toast.makeText(MainActivity.this, R.string.connect, Toast.LENGTH_LONG).show();
                        isConnected = true;
                    }
                }
            });
        }
    };

    private Emitter.Listener onDisconnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.i(TAG, "disconnected");
                    isConnected = false;
                    Toast.makeText(MainActivity.this, R.string.disconnect, Toast.LENGTH_LONG).show();
                }
            });
        }
    };

    private Emitter.Listener onConnectError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.e(TAG, "Error connecting");
                    Toast.makeText(MainActivity.this, R.string.error_connect, Toast.LENGTH_LONG).show();
                }
            });
        }
    };

    private Emitter.Listener onNewMessage = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    StringBuilder stringBuilder = new StringBuilder();
                    JSONObject data = (JSONObject) args[0];
                    JSONObject user;
                    String userMsg;
                    String message;
                    Log.i(TAG, "run: MESSAGEGET");
                    
                    try {
                        user = data.getJSONObject("User");
                        userMsg = user.getString("Name");
                        userMsg += ": ";
                        message = data.getString("Content");
                        Log.i(TAG, "run: " + message);
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }

                    //removeTyping(username);
                    addMessage(userMsg, message);
                }
            });
        }
    };

    private Emitter.Listener onViewersChange = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String userMsg;
                    int numUsers = 0;

                    try {
                        //username = data.getString("username");
                        numUsers = data.getInt(chatID);
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }

                    //addLog(getResources().getString(R.string.message_user_joined, username));
                    viewerCountTextView.setText(String.valueOf(numUsers));
                }
            });
        }
    };

    private Emitter.Listener onTyping = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String userMsg;

                    try {
                        userMsg = data.getString("username");
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }

                    addTyping(userMsg);
                }
            });
        }
    };

    private Emitter.Listener onStopTyping = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String userMsg;

                    try {
                        userMsg = data.getString("username");
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }

                    removeTyping(userMsg);
                }
            });
        }
    };

    private Runnable onTypingTimeout = new Runnable() {
        @Override
        public void run() {
            if (!typing) {
                return;
            }

            typing = false;
            socket.emit("stop typing");
        }
    };

    private void addLog(String message) {
        messages.add(new Message.Builder(Message.TYPE_LOG).message(message).build());
        messageAdapter.notifyItemInserted(messages.size() - 1);
        scrollToBottom();
    }

    private void leave() {
        username = null;
        socket.disconnect();
        socket.connect();
        startSignIn();
    }

    private void addMessage(String username, String message) {
        messages.add(new Message.Builder(Message.TYPE_MESSAGE).username(username).message(message).build());
        messageAdapter.notifyItemInserted(messages.size() - 1);
        scrollToBottom();
    }

    private void addTyping(String username) {
        messages.add(new Message.Builder(Message.TYPE_ACTION).username(userMsg).build());
        messageAdapter.notifyItemInserted(messages.size() - 1);
        scrollToBottom();
    }

    private void removeTyping(String username) {
        for (int i = messages.size() - 1; i >= 0; i--) {
            Message message = messages.get(i);

            if (message.getType() == Message.TYPE_ACTION && message.getUsername().equals(userMsg)) {
                messages.remove(i);
                messageAdapter.notifyItemRemoved(i);
            }
        }
    }

    private void startSignIn() {
        username = null;
        Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
        startActivityForResult(intent, REQUEST_LOGIN);
    }

    private void scrollToBottom() {
        messagesView.scrollToPosition(messageAdapter.getItemCount() - 1);
    }


    public static PrivateKey loadPrivateKey(String stored) throws GeneralSecurityException, IOException
    {
        byte [] pkcs8EncodedBytes = android.util.Base64.decode(stored, android.util.Base64.DEFAULT);

        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(pkcs8EncodedBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        PrivateKey privKey = kf.generatePrivate(keySpec);

        return privKey;
    }

    private void attemptSend() {
         if (null == username)
                 return;

         if (!socket.connected())
                 return;

         try {
             //socket.disconnect();
             //socket = IO.socket("http://back3ndb0is.herokuapp.com/chat/socket");
             //connectSocket();
         } catch(Exception e){
             e.printStackTrace();
         }

        String message = messageEditText.getText().toString().trim();

        if (TextUtils.isEmpty(message)) {
            messageEditText.requestFocus();
            return;
        }

        messageEditText.setText("");

        JSONObject packet = new JSONObject();

        String signedPacket = "";

        try {


            Log.i(TAG, "attemptSend: message: " + message);
            Log.i(TAG, "attemptSend: username: " + username);
            Log.i(TAG, "attemptSend: chatID: " + chatID);
            Log.i(TAG, "attemptSend: userkey: " + cerftificateName);


            packet.put("content", message);
            packet.put("username", username);
            packet.put("stream", chatID);
            packet.put("userkey", cerftificateName);

            byte[] data = packet.toString().getBytes();

            Signature instance = Signature.getInstance("SHA256withRSA");
            instance.initSign(privateKey);
            instance.update(data);
            byte[] signatureBytes = instance.sign();

            StringBuilder sb = new StringBuilder();
            for (int i=0; i<signatureBytes.length; i++) {
                sb.append(String.format("%02X ",signatureBytes[i]));
            }

            signedPacket = sb.toString();
            signedPacket =  signedPacket.replace(" ", "");

            signedPacket = signedPacket.toLowerCase();

            packet.put("signature", signedPacket);

        } catch (Exception e){
            e.printStackTrace();
        }


        Log.i(TAG, "attemptSend: " + packet);

        socket.emit("MESSAGE_SEND", packet);
    }
}
