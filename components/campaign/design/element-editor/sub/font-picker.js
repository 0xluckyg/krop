import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { FixedSizeList } from 'react-window';
import { withStyles, createStyles } from '@material-ui/core/styles';
import LocalizedStrings from 'react-localization';

import { fontFamilies, insertGoogleFont } from '../../../../reusable/font-families';

let strings = new LocalizedStrings({
    en:{
        searchLabel: "Search..."
    },
    kr: {
        searchLabel: "찾기..."
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

const fontListStyles = () => {
    createStyles({
        root: {
            minWidth: 225
        }
    });
}

let FONT_CACHE = {};

const isServer = typeof window === 'undefined';

function loadFont(family) {
    if (!family || isServer || FONT_CACHE[family]) {
        return;
    }
    insertGoogleFont(document, family)
    FONT_CACHE[family] = true;
}

function Row(props) {
  const { index, style, data } = props;
  const onFontSelected =
    data && data.onFontSelected ? data.onFontSelected : null;
  
  const { family } = data.filteredFontFamilies[index];

  useEffect(() => {
    loadFont(family);
  }, [data.filteredFontFamilies]);

  return (
        <ListItem
            button
            style={style}
            key={index}
            onClick={() => {
                onFontSelected && onFontSelected(data.filteredFontFamilies[index])
            }}
        >
            <ListItemText
                primary={family}
                style={{ fontFamily: family }}
                disableTypography
            />
        </ListItem>
  );
}


function FontList({ classes, className, onFontSelected, searchable }) {
    const [query, setQuery] = useState('');
    const [filteredFontFamilies, setFilteredFontFamilies] = useState(fontFamilies);

    return (
        <Paper className={clsx(classes.root, className)}>
            {searchable && (
                <ListItem>
                    <TextField
                        value={query}
                        style={styles.searchTextField}
                        placeholder={strings.searchLabel}
                        onChange={(event) => {
                            const value = event.target.value || '';
                            setQuery(value);
                            if (value === '') {
                                setFilteredFontFamilies(fontFamilies);
                            } else {
                                setFilteredFontFamilies(fontFamilies.filter((family) => {
                                    const re = new RegExp(value, 'gi');
                                    return re.test(family.family);
                                }))
                            }
                        }}
                    />
                </ListItem>
            )}
            <FixedSizeList
                height={300}
                itemSize={46}
                itemCount={filteredFontFamilies.length}
                outerElementType={List}
                itemData={{ onFontSelected, filteredFontFamilies }}
            >
                {Row}
            </FixedSizeList>
        </Paper>
    );
}

const styles = {
    searchTextField: {
        width: '100%',
		padding: 0,
		marginTop: 10 
	}
}

export default withStyles(fontListStyles)(FontList);