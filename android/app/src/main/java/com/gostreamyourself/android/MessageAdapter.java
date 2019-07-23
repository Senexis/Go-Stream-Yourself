package com.gostreamyourself.android;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.TextView;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class MessageAdapter extends RecyclerView.Adapter<MessageAdapter.ViewHolder> {

    private List<Message> messages;
    private LayoutInflater inflater;
    private Context context;
    private int lastPosition = -1;
    private int[] usernameColors;

    // data is passed into the constructor
    MessageAdapter(Context context, List<Message> data) {
        this.inflater = LayoutInflater.from(context);
        this.messages = data;
        this.context = context;
        usernameColors = context.getResources().getIntArray(R.array.username_colors);
    }

    // inflates the row layout from xml when needed
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.item_message, parent, false);

        return new ViewHolder(view);
    }

    // binds the data to the TextView in each row
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Message message = messages.get(position);
        holder.setMessage(message.getMessage());
        holder.setUsername(message.getUsername());
        setAnimation(holder.itemView, position);
    }

    // total number of rows
    @Override
    public int getItemCount() {
        return messages.size();
    }


    // stores and recycles views as they are scrolled off screen
    public class ViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.username) TextView usernameView;
        @BindView(R.id.message) TextView messageView;

        ViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);


        }

        public void setUsername(String username) {
            if (null == usernameView) {
                return;
            }

            usernameView.setText(username);
            usernameView.setTextColor(getUsernameColor(username));
        }

        public void setMessage(String message) {
            if (null == message) {
                return;
            }

            messageView.setText(message);
        }

        private int getUsernameColor(String username) {
            int hash = 199;

            for (int i = 0, len = username.length(); i < len; i++) {
                hash = username.codePointAt(i) + (hash << 5) - hash;
            }

            int index = Math.abs(hash % usernameColors.length);
            return usernameColors[index];
        }
    }

    private void setAnimation(View viewToAnimate, int position)
    {
        // If the bound view wasn't previously displayed on screen, it's animated
        if (position > lastPosition)
        {
            Animation animation = AnimationUtils.loadAnimation(context, android.R.anim.slide_in_left);
            viewToAnimate.startAnimation(animation);
            lastPosition = position;
        }
    }
}
