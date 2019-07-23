package com.gostreamyourself.android;

import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.toolbox.HttpHeaderParser;

import java.io.UnsupportedEncodingException;
import java.util.Map;

public class CustomLoginRequest extends Request<CustomLoginRequest.ResponseM> {


    private Response.Listener<CustomLoginRequest.ResponseM> mListener;

    public CustomLoginRequest(int method, String url, Response.Listener<CustomLoginRequest.ResponseM> responseListener, Response.ErrorListener listener) {
        super(method, url, listener);
        this.mListener = responseListener;
    }


    @Override
    protected void deliverResponse(ResponseM response) {
        this.mListener.onResponse(response);
    }

    @Override
    protected Response<ResponseM> parseNetworkResponse(NetworkResponse response) {
        String parsed;
        try {
            parsed = new String(response.data, HttpHeaderParser.parseCharset(response.headers));
        } catch (UnsupportedEncodingException e) {
            parsed = new String(response.data);
        }

        ResponseM responseM = new ResponseM();
        responseM.headers = response.headers;
        responseM.response = parsed;

        return Response.success(responseM, HttpHeaderParser.parseCacheHeaders(response));
    }


    public static class ResponseM {
        Map<String, String> headers;
        String response;
    }
}
